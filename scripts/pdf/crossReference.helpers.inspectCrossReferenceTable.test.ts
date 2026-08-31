import { PDFDocument, PDFRef } from 'pdf-lib';
import { deflateSync } from 'zlib';
import {
  inspectCrossReferenceSection,
  inspectCrossReferenceTable,
  settleResidue,
} from './crossReference.helpers';
import { findDuplicateObjectNumbers } from './pdf-doctor.helpers';

const bytes = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0));

/** Appends a cross-reference section and a startxref that points at it. */
const withStartxref = (body: string, section: string): Uint8Array =>
  bytes(`${body}${section}\nstartxref\n${body.length}\n%%EOF\n`);

/** The head of the free list, which carries generation 65535 by convention. */
const CLASSIC_FREE = '0000000000 65535 f \n';

/**
 * A document body holding real `N G obj` headers, and the offset of each. The
 * confirmation step reads those headers, so a fixture that wants a verdict
 * rather than a screen has to provide them.
 */
const objectBodies = (
  headers: [number, number][],
): { body: string; offsets: number[] } => {
  const offsets: number[] = [];
  let body = '%PDF-1.7\n';

  for (const [objectNumber, generationNumber] of headers) {
    offsets.push(body.length);
    body += `${objectNumber} ${generationNumber} obj\n<< >>\nendobj\n`;
  }

  return { body, offsets };
};

/** One conforming twenty-byte in-use entry. */
const classicEntry = (offset: number, generation: number): string =>
  `${String(offset).padStart(10, '0')} ${String(generation).padStart(5, '0')} n \n`;

/**
 * Packs cross-reference stream entries into the big-endian fields `/W`
 * describes. A width of zero omits the field entirely.
 */
const packEntries = (
  entries: (number | null)[][],
  widths: number[],
): string => {
  let packed = '';

  for (const entry of entries) {
    entry.forEach((field, position) => {
      for (let step = widths[position] - 1; step >= 0; step -= 1) {
        packed += String.fromCharCode((field! >> (8 * step)) & 0xff);
      }
    });
  }

  return packed;
};

/**
 * Applies one PNG row filter, the inverse of what the helper has to undo.
 * Cross-reference stream data is one colour at eight bits, so the byte ahead
 * of the current one is the byte immediately to its left.
 */
const applyPngPredictor = (
  data: string,
  columns: number,
  filter: number,
): string => {
  const raw = Uint8Array.from(data, character => character.charCodeAt(0));
  let encoded = '';

  for (let row = 0; row < Math.ceil(raw.length / columns); row += 1) {
    encoded += String.fromCharCode(filter);

    for (let column = 0; column < columns; column += 1) {
      const at = row * columns + column;
      const value = raw[at] ?? 0;
      const left = column ? raw[at - 1] : 0;
      const up = row ? raw[at - columns] : 0;
      const upperLeft = row && column ? raw[at - columns - 1] : 0;
      let subtracted = 0;

      if (filter === 1) {
        subtracted = left;
      } else if (filter === 2) {
        subtracted = up;
      } else if (filter === 3) {
        subtracted = (left + up) >> 1;
      } else if (filter === 4) {
        const estimate = left + up - upperLeft;
        const fromLeft = Math.abs(estimate - left);
        const fromUp = Math.abs(estimate - up);
        const fromUpperLeft = Math.abs(estimate - upperLeft);
        subtracted =
          fromLeft <= fromUp && fromLeft <= fromUpperLeft
            ? left
            : fromUp <= fromUpperLeft
              ? up
              : upperLeft;
      }

      encoded += String.fromCharCode((value - subtracted) & 0xff);
    }
  }

  return encoded;
};

/**
 * A document whose only content is a cross-reference stream holding the given
 * entries, each `[type, second, third]`. Building real entry data rather than
 * an empty stream is what lets these tests exercise the generation scan.
 */
const crossReferenceStream = ({
  dictionary,
  entries,
  flate,
  omitLength,
  predictorColumns,
  predictorFilter,
  widths = [1, 2, 1],
}: {
  dictionary: string;
  entries: (number | null)[][];
  flate?: boolean;
  omitLength?: boolean;
  predictorColumns?: number;
  predictorFilter?: number;
  widths?: number[];
}): Uint8Array => {
  let data = packEntries(entries, widths);

  if (predictorFilter !== undefined) {
    data = applyPngPredictor(
      data,
      predictorColumns ?? widths.reduce((total, width) => total + width, 0),
      predictorFilter,
    );
  }
  if (flate) {
    data = deflateSync(Buffer.from(data, 'latin1')).toString('latin1');
  }

  return withStartxref(
    '%PDF-1.7\n',
    `9 0 obj\n<< ${dictionary}${omitLength ? '' : ` /Length ${data.length}`} >>\n` +
      `stream\n${data}\nendstream\nendobj\n`,
  );
};

const buildPdf = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  return pdfDoc;
};

/**
 * Reproduces what an incremental save by an external editor leaves behind: one
 * object number present at two generation numbers. pdf-lib keys its objects by
 * reference, so both survive into the writer.
 */
const buildPdfWithDuplicateObjectNumber = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.load(await (await buildPdf()).save());
  const [reference] = pdfDoc.context.enumerateIndirectObjects()[1];

  pdfDoc.context.assign(
    PDFRef.of(reference.objectNumber, reference.generationNumber + 1),
    pdfDoc.context.lookup(reference)!,
  );

  return pdfDoc;
};
describe('inspectCrossReferenceTable', () => {
  describe('documents pdf-lib wrote from an undamaged source', () => {
    it('finds no residue when object streams are disabled', async () => {
      const pdfDoc = await buildPdf();

      const result = inspectCrossReferenceTable(
        await pdfDoc.save({ useObjectStreams: false }),
      );

      expect(result.status).toBe('VALID');
      expect(result.residue).toEqual([]);
    });

    it('finds no residue when object streams are enabled', async () => {
      const pdfDoc = await buildPdf();

      const result = inspectCrossReferenceTable(
        await pdfDoc.save({ useObjectStreams: true }),
      );

      expect(result.status).toBe('VALID');
      expect(result.residue).toEqual([]);
    });
  });

  // The defect these tools exist for. Both writers share it, so neither save
  // option is a remedy — see the header comment on pdf-doctor.helpers.ts.
  describe('a source document carrying one object number at two generations', () => {
    // Object #2 is the /Catalog, and its second copy is written straight after
    // it, so the table files that row under object 3. Reading the header at
    // that row's offset finds `2 1 obj`, which both proves the shift and names
    // the duplicate. A collision on the document spine is why the failure
    // presents as "0 of 0 pages" rather than as a missing image.
    it('names the duplicated object in a classic cross-reference table', async () => {
      const pdfDoc = await buildPdfWithDuplicateObjectNumber();

      const result = inspectCrossReferenceTable(
        await pdfDoc.save({ useObjectStreams: false }),
      );

      expect(result.status).toBe('DUPLICATED');
      expect(result.displacedObjectNumber).toBe(3);
      expect(result.residue.map(entry => entry.objectNumber)).toEqual([3]);
      // The section proves rows are displaced from object 3 on; naming the
      // object that actually collided takes a full read, and it is object 2.
      expect(
        findDuplicateObjectNumbers(pdfDoc).duplicates[0].objectNumber,
      ).toBe(2);
    });

    // PDFStreamWriter excludes any object above generation zero from an object
    // stream, so the residue stays a top-level entry the scan can read.
    it('names the duplicated object in a cross-reference stream', async () => {
      const pdfDoc = await buildPdfWithDuplicateObjectNumber();

      const result = inspectCrossReferenceTable(
        await pdfDoc.save({ useObjectStreams: true }),
      );

      expect(result.status).toBe('DUPLICATED');
      expect(result.displacedObjectNumber).toBe(3);
    });

    // The regression that motivated this detector. `/Size` is one greater than
    // the highest object number, not a count of rows, so an unused range of
    // object numbers makes the entry count fall short of `/Size` by exactly as
    // much as a duplicate overshoots it. Comparing the two therefore reported
    // a document carrying both as merely under-declared, and the real defect
    // went unrecorded.
    it('still catches the duplicate when unused object numbers mask the count', async () => {
      const pdfDoc = await buildPdfWithDuplicateObjectNumber();
      pdfDoc.context.assign(PDFRef.of(500, 0), pdfDoc.context.obj({}));

      for (const useObjectStreams of [false, true]) {
        const result = inspectCrossReferenceTable(
          await pdfDoc.save({ useObjectStreams }),
        );

        expect(result.status).toBe('DUPLICATED');
        expect(result.displacedObjectNumber).toBe(3);
        // The count the old detector judged on is short of /Size here, which
        // is exactly why it could not see the duplicate.
        expect(result.entryCount).toBeLessThan(result.size!);
      }
    });
  });

  describe('classic cross-reference tables', () => {
    it('finds no residue when every in-use entry is at generation zero', () => {
      const { body, offsets } = objectBodies([
        [5, 0],
        [6, 0],
      ]);

      const result = inspectCrossReferenceTable(
        withStartxref(
          body,
          `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 0)}` +
            'trailer\n<< /Size 7 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('VALID');
      expect(result.entryCount).toBe(3);
      expect(result.residue).toEqual([]);
    });

    // The whole reason the generation cannot be the verdict on its own. This
    // document reuses object 6 at generation 1 and says so accurately: the row
    // filed under object 6 points at `6 1 obj`. Nothing is displaced, and the
    // document opens without complaint.
    it('clears a raised generation whose entry points at the object it names', () => {
      const { body, offsets } = objectBodies([
        [5, 0],
        [6, 1],
      ]);

      const result = inspectCrossReferenceTable(
        withStartxref(
          body,
          `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 1)}` +
            'trailer\n<< /Size 7 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('VALID');
      expect(result.residue).toHaveLength(1);
      expect(result.displacedObjectNumber).toBeNull();
      expect(result.reason).toContain('no object number is duplicated');
    });

    // Object 5 written twice, at two generations. The second copy takes the
    // row that should belong to object 6, so the row filed under 6 points at
    // `5 1 obj` — and names the duplicate in the process.
    it('condemns a raised generation whose entry points at a lower object', () => {
      const { body, offsets } = objectBodies([
        [5, 0],
        [5, 1],
      ]);

      const result = inspectCrossReferenceTable(
        withStartxref(
          body,
          `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 1)}` +
            'trailer\n<< /Size 7 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('DUPLICATED');
      expect(result.displacedObjectNumber).toBe(6);
      expect(result.reason).toContain('points at object 5');
    });

    // Unreadable is not sound. A row nobody could settle leaves the document a
    // candidate rather than clearing it.
    it('holds a residue row whose offset has no object header as a candidate', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(15, 0)}${classicEntry(90, 1)}` +
            'trailer\n<< /Size 7 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('RESIDUE');
      expect(result.reason).toContain('does not point at an object header');
    });

    // Unused object numbers are ordinary. They used to make a healthy document
    // look under-declared, which is the comparison this detector replaced.
    it('does not accuse a table whose object numbers are not contiguous', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}50 1\n${classicEntry(15, 0)}` +
            'trailer\n<< /Size 51 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('VALID');
      expect(result.entryCount).toBe(2);
      expect(result.size).toBe(51);
    });

    it('ignores the generation on a free entry', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}trailer\n<< /Size 1 /Root 1 0 R >>\n`,
        ),
      );

      expect(result.status).toBe('VALID');
    });

    it('cannot judge a table with no trailer dictionary', () => {
      const result = inspectCrossReferenceTable(
        withStartxref('%PDF-1.7\n', `xref\n0 1\n${CLASSIC_FREE}`),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('no trailer dictionary');
    });

    it('cannot judge entries that are not the conforming width', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          'xref\n0 1\n0000000000 65535 f\ntrailer\n<< /Size 1 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('conforming entry widths');
    });

    it('cannot judge an entry whose fields are not the conforming shape', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          'xref\n0 1\n000000000 655355 f \ntrailer\n<< /Size 1 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('conforming entry widths');
    });

    it('cannot judge an unreadable subsection header', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          'xref\nnot-a-subsection-header\ntrailer\n<< /Size 1 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('conforming entry widths');
    });

    it('cannot judge a subsection header that runs past the end of the table', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 9\n${CLASSIC_FREE}trailer\n<< /Size 9 /Root 1 0 R >>\n`,
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
    });
  });

  // A legitimate incremental file reuses object numbers at a higher generation
  // by design, so the scan does not apply and must not produce an accusation.
  describe('incrementally updated documents', () => {
    it('declines to judge a classic table that chains to a previous revision', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}5 1\n${classicEntry(90, 1)}` +
            'trailer\n<< /Size 40 /Prev 116 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('incrementally updated');
      expect(result.residue).toEqual([]);
    });

    it('declines to judge a cross-reference stream that chains to a previous revision', () => {
      const result = inspectCrossReferenceTable(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 40 /Index [ 0 2 ] /Prev 116 /W [1 2 1]',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.residue).toEqual([]);
    });
  });

  // A hybrid-reference file carries a classic table for older readers next to
  // a cross-reference stream holding the rest, linked by /XRefStm. Its classic
  // table describes only part of the document by design.
  describe('hybrid-reference documents', () => {
    it('declines to judge a classic table that defers to an /XRefStm', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}5 1\n${classicEntry(90, 1)}` +
            'trailer\n<< /Size 40 /XRefStm 984 /Root 1 0 R >>\n',
        ),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('hybrid-reference');
      expect(result.residue).toEqual([]);
    });

    it('reports the hybrid reason ahead of the incremental one', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\n',
          `xref\n0 1\n${CLASSIC_FREE}` +
            'trailer\n<< /Size 40 /Prev 116 /XRefStm 984 /Root 1 0 R >>\n',
        ),
      );

      expect(result.reason).toContain('hybrid-reference');
    });
  });

  describe('documents that cannot be located', () => {
    it('cannot judge a document with no startxref', () => {
      const result = inspectCrossReferenceTable(bytes('%PDF-1.7\n%%EOF\n'));

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('no startxref');
    });

    it('cannot judge a startxref that points past the end of the document', () => {
      const result = inspectCrossReferenceTable(
        bytes('%PDF-1.7\nstartxref\n99999\n%%EOF\n'),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('outside the document');
    });

    it('cannot judge a startxref of zero', () => {
      const result = inspectCrossReferenceTable(
        bytes('%PDF-1.7\nstartxref\n0\n%%EOF\n'),
      );

      expect(result.status).toBe('INDETERMINATE');
    });

    it('reads the last startxref when the document contains several', () => {
      const result = inspectCrossReferenceTable(
        withStartxref(
          '%PDF-1.7\nstartxref\n0\n',
          `xref\n0 1\n${CLASSIC_FREE}trailer\n<< /Size 1 /Root 1 0 R >>\n`,
        ),
      );

      expect(result.status).toBe('VALID');
    });
  });

  it('preserves byte values above 0x7F while decoding', () => {
    const result = inspectCrossReferenceTable(
      withStartxref(
        '%PDF-1.7\n%\x80\x9F\xFF\n',
        `xref\n0 1\n${CLASSIC_FREE}trailer\n<< /Size 1 /Root 1 0 R >>\n`,
      ),
    );

    expect(result.status).toBe('VALID');
  });

  it('decodes documents larger than one chunk', () => {
    const result = inspectCrossReferenceTable(
      withStartxref(
        `%PDF-1.7\n%${'a'.repeat(25000)}\n`,
        `xref\n0 1\n${CLASSIC_FREE}trailer\n<< /Size 1 /Root 1 0 R >>\n`,
      ),
    );

    expect(result.status).toBe('VALID');
  });
});

describe('settleResidue', () => {
  // The audit fetches each header by a range request, and a request can fail.
  // A residue entry nobody could read is unknown, never sound.
  it('holds a residue row whose header was never read as a candidate', () => {
    const { body, offsets } = objectBodies([[6, 1]]);
    const screened = inspectCrossReferenceSection(
      bytes(
        `xref\n0 1\n${CLASSIC_FREE}6 1\n${classicEntry(offsets[0], 1)}` +
          'trailer\n<< /Size 7 /Root 1 0 R >>\n',
      ),
    );
    expect(screened.status).toBe('RESIDUE');

    const result = settleResidue(screened, new Map());

    expect(result.status).toBe('RESIDUE');
    expect(result.reason).toContain('could not be read at its offset');
    expect(body).toContain('6 1 obj');
  });

  it('leaves a document the screen already settled alone', () => {
    const screened = inspectCrossReferenceSection(
      bytes(`xref\n0 1\n${CLASSIC_FREE}trailer\n<< /Size 1 /Root 1 0 R >>\n`),
    );

    expect(settleResidue(screened, new Map())).toBe(screened);
  });
});

// The regression that made an earlier version of this detector clear genuinely
// broken files. `enumerateIndirectObjects` sorts by object number with no
// tiebreaker on generation, so of a duplicated pair either copy may be written
// first. When the raised generation comes first, that row is correctly
// attributed and the row displaced by it sits at generation zero — invisible
// to any check that only looks at rows above generation zero.
describe('a duplicate whose raised generation is written first', () => {
  const buildEitherOrder = async (
    raisedFirst: boolean,
  ): Promise<PDFDocument> => {
    const pdfDoc = await PDFDocument.load(await (await buildPdf()).save());
    const original = PDFRef.of(2, 0);
    const catalog = pdfDoc.context.lookup(original)!;

    if (raisedFirst) {
      pdfDoc.context.delete(original);
      pdfDoc.context.assign(PDFRef.of(2, 1), catalog);
      pdfDoc.context.assign(original, catalog);
    } else {
      pdfDoc.context.assign(PDFRef.of(2, 1), catalog);
    }

    return pdfDoc;
  };

  it.each([
    [false, false],
    [false, true],
    [true, false],
    [true, true],
  ])(
    'condemns it with raisedFirst=%s, objectStreams=%s',
    async (raisedFirst, useObjectStreams) => {
      const pdfDoc = await buildEitherOrder(raisedFirst);

      const result = inspectCrossReferenceTable(
        await pdfDoc.save({ useObjectStreams }),
      );

      expect(result.status).toBe('DUPLICATED');
    },
  );

  it('is invisible to the raised row alone when that row comes first', async () => {
    const pdfDoc = await buildEitherOrder(true);

    const result = inspectCrossReferenceTable(
      await pdfDoc.save({ useObjectStreams: false }),
    );

    // The one row above generation zero is filed under the object it points
    // at, so on its own it looks sound. The displaced row is at generation
    // zero, which is why the probe set cannot be the residue alone.
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([2]);
    expect(result.probes.length).toBeGreaterThan(result.residue.length);
    expect(result.status).toBe('DUPLICATED');
  });
});

// Layer 1: unused object numbers push the row count below /Size and never
// above it, so a surplus is proof on its own — and it reaches the case a probe
// cannot, where both copies of a duplicate are compressed.
describe('over-declaration', () => {
  it('condemns a section declaring more rows than /Size accounts for', () => {
    const { body, offsets } = objectBodies([
      [5, 0],
      [6, 1],
    ]);

    const result = inspectCrossReferenceTable(
      withStartxref(
        body,
        `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 1)}` +
          'trailer\n<< /Size 2 /Root 1 0 R >>\n',
      ),
    );

    // Every row points at the object it is filed under, so no probe finds a
    // displacement. The arithmetic condemns it regardless.
    expect(result.overDeclaredBy).toBe(1);
    expect(result.status).toBe('DUPLICATED');
    expect(result.reason).toContain('only duplicated object numbers can cause');
  });

  // Two rows under one object number must differ in generation, so a surplus
  // with nothing above generation zero should not occur. Condemn it anyway
  // rather than clear a document the arithmetic proves is damaged.
  it('condemns an over-declared section carrying no residue at all', () => {
    const { body, offsets } = objectBodies([
      [5, 0],
      [6, 0],
    ]);

    const result = inspectCrossReferenceTable(
      withStartxref(
        body,
        `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 0)}` +
          'trailer\n<< /Size 2 /Root 1 0 R >>\n',
      ),
    );

    expect(result.residue).toEqual([]);
    expect(result.overDeclaredBy).toBe(1);
    expect(result.status).toBe('DUPLICATED');
    expect(result.reason).toContain('unexpected');
  });

  it('does not accuse a section whose count merely falls short of /Size', () => {
    const { body, offsets } = objectBodies([[50, 0]]);

    const result = inspectCrossReferenceTable(
      withStartxref(
        body,
        `xref\n0 1\n${CLASSIC_FREE}50 1\n${classicEntry(offsets[0], 0)}` +
          'trailer\n<< /Size 51 /Root 1 0 R >>\n',
      ),
    );

    expect(result.overDeclaredBy).toBe(0);
    expect(result.status).toBe('VALID');
  });
});

// Layer 4: a clean pass only means something if the probes reached far enough.
describe('probe coverage', () => {
  it('acquits when the last row of the affected subsection was probed', () => {
    const { body, offsets } = objectBodies([
      [5, 0],
      [6, 1],
    ]);

    const result = inspectCrossReferenceTable(
      withStartxref(
        body,
        `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 0)}${classicEntry(offsets[1], 1)}` +
          'trailer\n<< /Size 7 /Root 1 0 R >>\n',
      ),
    );

    expect(result.coverageComplete).toBe(true);
    expect(result.status).toBe('VALID');
  });

  // The subsection ends on a free row, which carries a next-free-object number
  // rather than a byte offset and so cannot be probed. A duplicate sitting
  // after the last readable row would leave no trace here, so a clean pass
  // cannot clear the document.
  it('holds a document as a candidate when the last row cannot be probed', () => {
    const { body, offsets } = objectBodies([[5, 1]]);

    const result = inspectCrossReferenceTable(
      withStartxref(
        body,
        `xref\n0 1\n${CLASSIC_FREE}5 2\n${classicEntry(offsets[0], 1)}${CLASSIC_FREE}` +
          'trailer\n<< /Size 8 /Root 1 0 R >>\n',
      ),
    );

    expect(result.coverageComplete).toBe(false);
    expect(result.status).toBe('RESIDUE');
    expect(result.reason).toContain('cannot be probed');
  });
});
