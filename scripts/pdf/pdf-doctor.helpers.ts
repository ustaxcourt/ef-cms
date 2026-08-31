import {
  PDFArray,
  type PDFContext,
  PDFDict,
  type PDFDocument,
  PDFName,
  PDFRef,
  PDFStream,
} from 'pdf-lib';

/**
 * Surveys and repairs the duplicated object numbers themselves, working on a
 * loaded document rather than on raw bytes. `crossReference.helpers.ts` is the
 * byte-level counterpart: it decides whether a document is affected without
 * loading it, which is what makes a survey of stored documents affordable.
 */

export type DuplicateObjectNumber = {
  generations: number[];
  keptGeneration: number;
  liveGenerations: number[];
  objectNumber: number;
  objectType: string | null;
};

export type DuplicateReport = {
  duplicates: DuplicateObjectNumber[];
  objectsBefore: number;
  unresolved: number;
};

export type RepairResult = DuplicateReport & {
  referencesRemoved: number;
};

/** Every reference held directly by an object, one level deep. */
const referencesWithin = (value: unknown): PDFRef[] => {
  const found: PDFRef[] = [];

  const collect = (candidate: unknown): void => {
    if (candidate instanceof PDFRef) {
      found.push(candidate);
    } else if (candidate instanceof PDFArray) {
      candidate.asArray().forEach(collect);
    } else if (candidate instanceof PDFDict) {
      candidate.entries().forEach(([, entry]) => collect(entry));
    } else if (candidate instanceof PDFStream) {
      candidate.dict.entries().forEach(([, entry]) => collect(entry));
    }
  };

  collect(value);

  return found;
};

const referenceKey = (ref: PDFRef): string =>
  `${ref.objectNumber}_${ref.generationNumber}`;

/**
 * The `/Type` an object declares, which locates a collision within the
 * document: `Catalog`, `Pages` and `Page` are the structural spine that every
 * editing pass rewrites, and a duplicate there misattributes the rows for
 * every object after it.
 *
 * Returns null for the many objects that declare no type at all — content
 * streams and resource dictionaries among them.
 */
const declaredTypeOf = (context: PDFContext, ref: PDFRef): string | null => {
  const resolved = context.lookup(ref);
  const dict = resolved instanceof PDFStream ? resolved.dict : resolved;
  const declared =
    dict instanceof PDFDict ? dict.get(PDFName.of('Type')) : undefined;

  return declared instanceof PDFName ? declared.decodeText() : null;
};

/**
 * Identifies every object number present at more than one generation and
 * decides which copy is the live one, without modifying the document.
 *
 * Survival is decided by reachability from `/Root`, never by age. A reference
 * names a specific generation, and the live copy may be either one: an
 * observed document kept generation 0 alive while generation 1 was the dead
 * leftover. Deleting "the older one" removes objects the document still uses.
 */
const surveyDuplicateObjectNumbers = (
  pdfDoc: PDFDocument,
): DuplicateReport & { keep: Map<number, PDFRef> } => {
  const { context } = pdfDoc;

  const reachable = new Set<string>();
  const root = context.trailerInfo.Root;
  const pending: PDFRef[] = root instanceof PDFRef ? [root] : [];
  while (pending.length) {
    const ref = pending.pop()!;
    if (reachable.has(referenceKey(ref))) {
      continue;
    }
    reachable.add(referenceKey(ref));
    const resolved = context.lookup(ref);
    if (resolved) {
      referencesWithin(resolved).forEach(child => pending.push(child));
    }
  }
  const isLive = (ref: PDFRef): boolean => reachable.has(referenceKey(ref));

  const byObjectNumber = new Map<number, PDFRef[]>();
  const objectsBefore = context.enumerateIndirectObjects().length;
  for (const [ref] of context.enumerateIndirectObjects()) {
    const existing = byObjectNumber.get(ref.objectNumber);
    if (existing) {
      existing.push(ref);
    } else {
      byObjectNumber.set(ref.objectNumber, [ref]);
    }
  }

  const duplicates: DuplicateObjectNumber[] = [];
  const keep = new Map<number, PDFRef>();
  let unresolved = 0;

  for (const [objectNumber, refs] of byObjectNumber) {
    if (refs.length === 1) {
      keep.set(objectNumber, refs[0]);
      continue;
    }

    const live = refs.filter(isLive);
    let kept: PDFRef;
    if (live.length === 1) {
      kept = live[0];
    } else {
      // Either nothing is reachable or several copies are. Neither is safe to
      // decide automatically; fall back to the highest generation and report
      // it so the caller can verify the result before trusting it.
      unresolved += 1;
      kept = (live.length ? live : refs).reduce((a, b) =>
        b.generationNumber > a.generationNumber ? b : a,
      );
    }

    keep.set(objectNumber, kept);
    duplicates.push({
      generations: refs.map(ref => ref.generationNumber).sort((a, b) => a - b),
      keptGeneration: kept.generationNumber,
      liveGenerations: live
        .map(ref => ref.generationNumber)
        .sort((a, b) => a - b),
      objectNumber,
      objectType: declaredTypeOf(context, kept),
    });
  }

  return { duplicates, keep, objectsBefore, unresolved };
};

/**
 * Reports the duplicated object numbers a document carries, leaving the
 * document untouched. Use this to diagnose; use `repairDuplicateObjectNumbers`
 * to act.
 */
export const findDuplicateObjectNumbers = (
  pdfDoc: PDFDocument,
): DuplicateReport => {
  const { duplicates, objectsBefore, unresolved } =
    surveyDuplicateObjectNumbers(pdfDoc);

  return { duplicates, objectsBefore, unresolved };
};

/**
 * Removes the superseded copy of every object number that appears at more than
 * one generation, leaving the table with one row per object number.
 *
 * Nothing reachable is discarded, so content is preserved. The caller must
 * save with `useObjectStreams: false` so that any residual damage stays
 * recoverable by a reader that rescans for object headers.
 */
export const repairDuplicateObjectNumbers = (
  pdfDoc: PDFDocument,
): RepairResult => {
  const { context } = pdfDoc;
  const { duplicates, keep, objectsBefore, unresolved } =
    surveyDuplicateObjectNumbers(pdfDoc);

  let referencesRemoved = 0;
  for (const [ref] of context.enumerateIndirectObjects()) {
    if (keep.get(ref.objectNumber) !== ref) {
      context.delete(ref);
      referencesRemoved += 1;
    }
  }

  return { duplicates, objectsBefore, referencesRemoved, unresolved };
};
