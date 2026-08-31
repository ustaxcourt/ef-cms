import {
  type CrossReferenceEntry,
  START_XREF_SCAN_BYTES,
  decodeCrossReferenceStreamData,
  decodeLatin1,
  readClassicEntries,
  readCrossReferenceStreamEntries,
  readDictionaryInteger,
  readIntegerArray,
} from './crossReferenceEntries.helpers';

export { START_XREF_SCAN_BYTES } from './crossReferenceEntries.helpers';
export type { CrossReferenceEntry } from './crossReferenceEntries.helpers';

/**
 * Detection and repair for the residue pdf-lib leaves in a cross-reference
 * section when a document carries the same object number at two different
 * generation numbers.
 *
 * pdf-lib builds the section by walking its in-memory objects in ascending
 * object number and opening a new subsection only when the object number
 * advances by more than one. A document carrying one object number at two
 * generations — the residue of an incremental save by an external editor —
 * therefore contributes two rows under a single object number. Every row after
 * the duplicate is then attributed to the wrong object, and a reader following
 * the section reaches the wrong bytes.
 *
 * Both of pdf-lib's writers share the defect, so `useObjectStreams: false` is
 * not a remedy; a classic table merely leaves plain-text object headers behind
 * for a reader to recover from. Lenient parsers (PDFium, pdf.js) rebuild the
 * section by rescanning and render the document anyway. Adobe's engine, which
 * backs both Acrobat and Edge on Windows, rejects it outright.
 *
 * ## How the residue is detected
 *
 * The duplicate itself is invisible in the numbering: a subsection declares a
 * start and a count, so the shifted rows still read as consecutive object
 * numbers. What it does leave behind is a *generation number*. Two entries
 * under one object number must differ in generation — pdf-lib's context is
 * keyed by object number and generation together, so an exact repeat could not
 * be held twice — which means every duplicate contributes an in-use entry at a
 * generation above zero.
 *
 * That is the **screen**, and on its own it is not a verdict. A document may
 * carry an object at generation 1 with no collision at all — the ordinary
 * residue of a source that once freed and reused an object number — and such a
 * document is perfectly sound. Nothing in the trailing bytes distinguishes it
 * from a real duplicate.
 *
 * What distinguishes them is whether the rows are **shifted**. So a residue
 * entry is settled by reading the object header at the offset it points at:
 *
 * - the header names the object the entry is filed under → a sound reuse;
 * - it names a lower object number → that object is held at two generations,
 *   the section is misattributing every row from there on, and the header has
 *   just named the duplicate exactly.
 *
 * That costs one short read at a known offset, and only for the minority of
 * documents the screen flags. See `confirmResidue`.
 *
 * The screen is gap-immune, unlike comparing the entry count against `/Size`:
 * `/Size` is one greater than the highest object number rather than a count of
 * rows, so any document with unused object numbers legitimately declares fewer
 * entries than `/Size`, and a gap's deficit silently cancels a duplicate's
 * surplus.
 *
 * It is also gated to single-revision documents. In an incrementally updated
 * file, in-use entries above generation zero are exactly what a conforming
 * free-and-reuse produces, and accusing one would be wrong.
 *
 * Neither of pdf-lib's writers can hide a duplicate from the screen.
 * `PDFStreamWriter` excludes any object whose `generationNumber !== 0` from an
 * object stream, so the residue is always a top-level type-1 entry carrying its
 * generation, never a type-2 entry whose second field means something else.
 */

export type CrossReferenceStatus =
  'DUPLICATED' | 'INDETERMINATE' | 'RESIDUE' | 'VALID';

/** A row to check against the object header it points at. */
export type CrossReferenceProbe = {
  /** Byte offset the row claims the object lives at. */
  entryOffset: number;
  /** The object number the section files this row under. */
  objectNumber: number;
};

/** An in-use row filed at a generation above zero. */
export type GenerationResidue = CrossReferenceProbe & {
  generationNumber: number;
};

export type CrossReferenceIntegrity = {
  /**
   * The object number the section files the first row proved to be displaced
   * under. Null on every verdict but DUPLICATED.
   *
   * This is *not* the duplicated object: the duplicate is somewhere earlier in
   * the same subsection, and how much earlier depends on how many collisions
   * precede this row. Naming it needs a full read of the document — which is
   * what `findDuplicateObjectNumbers` and the audit's `--deep` are for.
   */
  displacedObjectNumber: number | null;
  /** Entries the section accounts for. Reported for context, never judged. */
  entryCount: number | null;
  reason: string;
  /**
   * Whether the probe set reaches far enough for a clean pass to mean
   * anything. True when the *last* row of every subsection holding residue is
   * probeable, since any duplicate in a subsection displaces its last row.
   *
   * When false, a clean pass proves nothing: the duplicate could sit past the
   * last row anyone can read.
   */
  coverageComplete: boolean;
  /**
   * How many rows the section declares beyond what `/Size` accounts for.
   * Positive only when object numbers are duplicated: unused numbers push the
   * count *below* `/Size` and never above it, so this direction is proof on
   * its own. Zero when there is nothing to report.
   */
  overDeclaredBy: number;
  /**
   * Rows whose header must be read to settle the screen. Empty unless the
   * status is RESIDUE. See `settleResidue`.
   */
  probes: CrossReferenceProbe[];
  /**
   * In-use rows above generation zero. Their presence is a screen, not a
   * verdict.
   */
  residue: GenerationResidue[];
  size: number | null;
  status: CrossReferenceStatus;
};

const INCREMENTAL_REASON =
  'the document is incrementally updated, so entries above generation zero are the expected result of a conforming free-and-reuse';

const HYBRID_REASON =
  'the document is a hybrid-reference file, so the classic table describes only some of its objects';

/**
 * Why a classic trailer cannot be judged, or null when it can.
 *
 * A hybrid-reference file carries a classic table for older readers alongside
 * a cross-reference stream holding the remaining objects, linked by /XRefStm.
 * Its classic table describes only part of the document, by design. An
 * incrementally updated document likewise describes only its own revision, and
 * legitimately reuses object numbers at a higher generation. Neither is
 * damaged, and neither must be accused.
 */
const classicComparisonBlocker = (trailer: string): string | null => {
  if (readDictionaryInteger(trailer, 'XRefStm') !== null) {
    return HYBRID_REASON;
  }

  return readDictionaryInteger(trailer, 'Prev') !== null
    ? INCREMENTAL_REASON
    : null;
};

/**
 * The rows worth reading a header for.
 *
 * The obvious choice — the row carrying the raised generation — is not enough.
 * `enumerateIndirectObjects` sorts by object number alone, with no tiebreaker
 * on generation, so of a duplicated pair either copy may be written first. If
 * the raised generation happens to come first, *that* row is still correctly
 * attributed and the row displaced by it is the one at generation zero, which
 * no generation-based check would ever look at.
 *
 * So the probe set is the last in-use row of every subsection holding residue
 * — displaced whichever copy came first, because the duplicate is somewhere
 * before it in the same subsection — together with the residue rows
 * themselves, which name the duplicated object outright when they are the
 * displaced ones.
 */
const probeSet = (
  entries: CrossReferenceEntry[],
  residueEntries: CrossReferenceEntry[],
): { coverageComplete: boolean; probes: CrossReferenceProbe[] } => {
  const affected = new Set(residueEntries.map(entry => entry.subsection));

  // The last row of each affected subsection, and the last one that can be
  // probed at all. They differ when a subsection ends on a compressed or free
  // row, whose second field is not a byte offset.
  const lastRow = new Map<number, CrossReferenceEntry>();
  const lastProbeable = new Map<number, CrossReferenceEntry>();
  for (const entry of entries) {
    if (!affected.has(entry.subsection)) {
      continue;
    }
    lastRow.set(entry.subsection, entry);
    if (entry.type === 1) {
      lastProbeable.set(entry.subsection, entry);
    }
  }

  const byOffset = new Map<number, CrossReferenceProbe>();
  for (const entry of [...residueEntries, ...lastProbeable.values()]) {
    byOffset.set(entry.offset, {
      entryOffset: entry.offset,
      objectNumber: entry.objectNumber,
    });
  }

  return {
    coverageComplete: [...affected].every(
      subsection => lastRow.get(subsection)?.type === 1,
    ),
    probes: [...byOffset.values()].sort(
      (a, b) => a.objectNumber - b.objectNumber,
    ),
  };
};

/**
 * Reaches a verdict from the decoded entries.
 *
 * The judgement rests on generation numbers alone. Entry count and `/Size` are
 * carried through for context — a reader comparing them can see the overshoot
 * a duplicate causes — but they are never the basis of an accusation, because
 * unused object numbers make `/Size` exceed the entry count on healthy files.
 */
const judge = ({
  entries,
  size,
  source,
  unjudgeable,
}: {
  entries: CrossReferenceEntry[];
  size: number | null;
  source: string;
  /** Why the section cannot be judged, or null when it can. */
  unjudgeable: string | null;
}): CrossReferenceIntegrity => {
  if (unjudgeable) {
    return {
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: entries.length,
      overDeclaredBy: 0,
      probes: [],
      reason: unjudgeable,
      residue: [],
      size,
      status: 'INDETERMINATE',
    };
  }

  // Unused object numbers push the row count below /Size, so a shortfall means
  // nothing. A surplus can only come from object numbers appearing twice.
  const overDeclaredBy =
    size !== null && entries.length > size ? entries.length - size : 0;

  const residueEntries = entries.filter(
    entry => entry.type === 1 && entry.generationNumber !== 0,
  );
  const residue = residueEntries
    .map(entry => ({
      entryOffset: entry.offset,
      generationNumber: entry.generationNumber,
      objectNumber: entry.objectNumber,
    }))
    .sort((a, b) => a.objectNumber - b.objectNumber);

  if (residue.length) {
    const { coverageComplete, probes } = probeSet(entries, residueEntries);

    return {
      coverageComplete,
      displacedObjectNumber: null,
      entryCount: entries.length,
      overDeclaredBy,
      probes,
      reason: `${source} holds ${residue.length} in-use row(s) above generation zero, filed under object ${residue.map(entry => entry.objectNumber).join(', ')}; whether that is a duplicated object number or a sound reuse is settled by the object headers those rows point at`,
      residue,
      size,
      status: 'RESIDUE',
    };
  }

  // Over-declared with nothing above generation zero should not be reachable,
  // since two rows under one object number must differ in generation. Condemn
  // it anyway and say so, rather than clear a document the arithmetic proves
  // is damaged.
  if (overDeclaredBy) {
    return {
      coverageComplete: true,
      displacedObjectNumber: null,
      entryCount: entries.length,
      overDeclaredBy,
      probes: [],
      reason: `${source} declares ${overDeclaredBy} row(s) more than the ${size} objects /Size accounts for, which only duplicated object numbers can cause - though no row sits above generation zero, which is unexpected and worth looking at directly`,
      residue,
      size,
      status: 'DUPLICATED',
    };
  }

  return {
    coverageComplete: true,
    displacedObjectNumber: null,
    entryCount: entries.length,
    overDeclaredBy,
    probes: [],
    reason: `all ${entries.length} row(s) in ${source} are at generation zero, and the count does not exceed /Size`,
    residue,
    size,
    status: 'VALID',
  };
};

const inspectClassicSection = (section: string): CrossReferenceIntegrity => {
  const trailerIndex = section.lastIndexOf('trailer');
  if (trailerIndex === -1) {
    return {
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: null,
      overDeclaredBy: 0,
      probes: [],
      reason: 'the cross-reference table has no trailer dictionary',
      residue: [],
      size: null,
      status: 'INDETERMINATE',
    };
  }

  const trailer = section.slice(trailerIndex);
  const entries = readClassicEntries(section.slice(0, trailerIndex));
  if (entries === null) {
    return {
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: null,
      overDeclaredBy: 0,
      probes: [],
      reason: 'the cross-reference table does not use conforming entry widths',
      residue: [],
      size: readDictionaryInteger(trailer, 'Size'),
      status: 'INDETERMINATE',
    };
  }

  return judge({
    entries,
    size: readDictionaryInteger(trailer, 'Size'),
    source: 'the cross-reference table',
    unjudgeable: classicComparisonBlocker(trailer),
  });
};

const unreadableStream = (
  size: number | null,
  reason: string,
): CrossReferenceIntegrity => ({
  coverageComplete: false,
  displacedObjectNumber: null,
  entryCount: null,
  overDeclaredBy: 0,
  probes: [],
  reason,
  residue: [],
  size,
  status: 'INDETERMINATE',
});

const inspectCrossReferenceStream = (
  sectionBytes: Uint8Array,
  section: string,
): CrossReferenceIntegrity | null => {
  const object = /^\s*\d+\s+\d+\s+obj\s*<<([\s\S]*?)>>\s*stream/.exec(section);
  if (!object || !/\/Type\s*\/XRef/.test(object[1])) {
    return null;
  }

  const dictionary = object[1];
  const size = readDictionaryInteger(dictionary, 'Size');

  const widths = readIntegerArray(dictionary, 'W');
  if (!widths) {
    return unreadableStream(size, 'the cross-reference stream has no valid /W');
  }

  // An absent /Index defaults to covering the whole document.
  const index =
    readIntegerArray(dictionary, 'Index') ?? (size === null ? null : [0, size]);
  if (!index) {
    return unreadableStream(
      size,
      'the cross-reference stream declares neither /Index nor /Size',
    );
  }

  const data = decodeCrossReferenceStreamData(
    sectionBytes,
    section,
    dictionary,
  );
  if (!data) {
    return unreadableStream(
      size,
      'the cross-reference stream could not be decoded',
    );
  }

  const entries = readCrossReferenceStreamEntries(data, widths, index);
  if (!entries) {
    return unreadableStream(
      size,
      'the cross-reference stream entries do not match its /W and /Index',
    );
  }

  return judge({
    entries,
    size,
    source: 'the cross-reference stream',
    unjudgeable:
      readDictionaryInteger(dictionary, 'Prev') !== null
        ? INCREMENTAL_REASON
        : null,
  });
};

/**
 * Reads the offset the document's final `startxref` points at.
 *
 * Takes the document's trailing bytes rather than the whole file, so a caller
 * fetching from remote storage can answer this from a range request of
 * `START_XREF_SCAN_BYTES`. `documentLength` is the length of the whole
 * document, which a range request reports separately from the bytes returned.
 */
export const locateCrossReferenceSection = (
  tailBytes: Uint8Array,
  documentLength: number,
): { offset: number | null; reason: string } => {
  const tail = decodeLatin1(tailBytes, 0);

  const offsets = [...tail.matchAll(/startxref\s+(\d+)/g)];
  if (!offsets.length) {
    return { offset: null, reason: 'the document has no startxref keyword' };
  }

  const offset = Number(offsets[offsets.length - 1][1]);
  if (offset <= 0 || offset >= documentLength) {
    return { offset: null, reason: 'startxref points outside the document' };
  }

  return { offset, reason: '' };
};

/**
 * Judges the cross-reference section itself, given the document's bytes from
 * the `startxref` offset onward. A caller that fetched only that range can
 * pass it directly.
 *
 * `INDETERMINATE` means the question could not be answered — an incremental
 * update, an undecodable section — and must never be treated as a failure.
 */
export const inspectCrossReferenceSection = (
  sectionBytes: Uint8Array,
): CrossReferenceIntegrity => {
  const section = decodeLatin1(sectionBytes, 0);

  if (/^\s*xref\b/.test(section)) {
    return inspectClassicSection(section);
  }

  return (
    inspectCrossReferenceStream(sectionBytes, section) ?? {
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: null,
      overDeclaredBy: 0,
      probes: [],
      reason: 'startxref does not point at a cross-reference table or stream',
      residue: [],
      size: null,
      status: 'INDETERMINATE',
    }
  );
};

/**
 * Bytes to read at a residue entry's offset to recover the `N G obj` header
 * that settles it. An object header is a handful of digits and a keyword, so
 * this is generous.
 */
export const OBJECT_HEADER_PROBE_BYTES = 64;

/**
 * Settles one probed row against the object header it points at.
 *
 * A row is correctly attributed when the header names the object the section
 * files it under. A **lower** number means rows have been displaced: the
 * duplicate was written straight after the object it duplicates, pushing
 * everything after it in the subsection one place along.
 */
export const confirmProbe = (
  probe: CrossReferenceProbe,
  headerBytes: Uint8Array,
): {
  /** The object the header actually carries, or null when unreadable. */
  actualObjectNumber: number | null;
  reason: string;
  status: 'DUPLICATED' | 'INDETERMINATE' | 'VALID';
} => {
  const header = /^\s*(\d+)\s+(\d+)\s+obj\b/.exec(decodeLatin1(headerBytes, 0));

  if (!header) {
    return {
      actualObjectNumber: null,
      reason: `the row filed under object ${probe.objectNumber} does not point at an object header, so it cannot be settled either way`,
      status: 'INDETERMINATE',
    };
  }

  const actualObjectNumber = Number(header[1]);
  if (actualObjectNumber === probe.objectNumber) {
    return {
      actualObjectNumber,
      reason: `the row filed under object ${probe.objectNumber} points at it, so the section is correctly attributed there`,
      status: 'VALID',
    };
  }

  return {
    actualObjectNumber,
    reason: `the row filed under object ${probe.objectNumber} points at object ${actualObjectNumber}, so rows have been displaced and every entry from there on is attributed to the wrong object`,
    status: 'DUPLICATED',
  };
};

/**
 * Settles a screened document, using three independent signals. Each can only
 * condemn or abstain; none can acquit on its own.
 *
 * 1. **Over-declaration.** More rows than `/Size` accounts for can only come
 *    from duplicated object numbers, and needs no reads at all. It reaches the
 *    case probes cannot: a duplicate whose copies are both compressed still
 *    inflates the count.
 * 2. **A displaced row.** Proof, and it locates where misattribution begins.
 * 3. **Coverage.** A clean pass acquits only when the probes reached the last
 *    row of every affected subsection. Otherwise the document stays a
 *    candidate — `RESIDUE` — because the duplicate could sit past the last row
 *    anyone can read.
 *
 * Headers are passed in rather than read here so that a caller fetching from
 * remote storage can await them all at once, and a caller holding the whole
 * document can slice them for nothing.
 */
export const settleResidue = (
  integrity: CrossReferenceIntegrity,
  headers: Map<number, Uint8Array>,
): CrossReferenceIntegrity => {
  if (integrity.status !== 'RESIDUE') {
    return integrity;
  }

  let unsettled: string | null = null;
  let displaced: { objectNumber: number; reason: string } | null = null;

  for (const probe of integrity.probes) {
    const header = headers.get(probe.entryOffset);
    if (!header) {
      unsettled = `the row filed under object ${probe.objectNumber} could not be read at its offset`;
      continue;
    }

    const verdict = confirmProbe(probe, header);
    if (verdict.status === 'INDETERMINATE') {
      unsettled = verdict.reason;
    }
    // The earliest displaced row is the most informative: the duplicate sits
    // somewhere before it.
    if (
      verdict.status === 'DUPLICATED' &&
      (!displaced || probe.objectNumber < displaced.objectNumber)
    ) {
      displaced = { objectNumber: probe.objectNumber, reason: verdict.reason };
    }
  }

  if (displaced) {
    return {
      ...integrity,
      displacedObjectNumber: displaced.objectNumber,
      reason: displaced.reason,
      status: 'DUPLICATED',
    };
  }

  if (integrity.overDeclaredBy) {
    return {
      ...integrity,
      reason: `no row was found displaced, but the section declares ${integrity.overDeclaredBy} row(s) more than the ${integrity.size} objects /Size accounts for, which only duplicated object numbers can cause`,
      status: 'DUPLICATED',
    };
  }

  if (unsettled) {
    return { ...integrity, reason: unsettled, status: 'RESIDUE' };
  }

  if (!integrity.coverageComplete) {
    return {
      ...integrity,
      reason: `${integrity.residue.length} row(s) sit above generation zero and none of the rows that could be read is displaced, but a subsection holding residue ends on a row that cannot be probed, so a duplicate past that point would not show here`,
      status: 'RESIDUE',
    };
  }

  return {
    ...integrity,
    reason: `${integrity.residue.length} row(s) sit above generation zero, and the last row of every subsection holding them points at the object it is filed under, so no object number is duplicated`,
    status: 'VALID',
  };
};

/** Judges a whole document held in memory, screen and confirmation together. */
export const inspectCrossReferenceTable = (
  pdfBytes: Uint8Array,
): CrossReferenceIntegrity => {
  const scanFrom = Math.max(0, pdfBytes.length - START_XREF_SCAN_BYTES);
  const { offset, reason } = locateCrossReferenceSection(
    pdfBytes.subarray(scanFrom),
    pdfBytes.length,
  );

  if (offset === null) {
    return {
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: null,
      overDeclaredBy: 0,
      probes: [],
      reason,
      residue: [],
      size: null,
      status: 'INDETERMINATE',
    };
  }

  const integrity = inspectCrossReferenceSection(pdfBytes.subarray(offset));

  return settleResidue(
    integrity,
    new Map(
      integrity.probes.map(({ entryOffset }) => [
        entryOffset,
        pdfBytes.subarray(entryOffset, entryOffset + OBJECT_HEADER_PROBE_BYTES),
      ]),
    ),
  );
};
