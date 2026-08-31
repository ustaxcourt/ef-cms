import { deflateSync } from 'zlib';
import {
  inspectCrossReferenceSection,
  inspectCrossReferenceTable,
} from './crossReference.helpers';

const bytes = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0));

/** Appends a cross-reference section and a startxref that points at it. */
const withStartxref = (body: string, section: string): Uint8Array =>
  bytes(`${body}${section}\nstartxref\n${body.length}\n%%EOF\n`);

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

  return bytes(
    `9 0 obj\n<< ${dictionary}${omitLength ? '' : ` /Length ${data.length}`} >>\n` +
      `stream\n${data}\nendstream\nendobj\n`,
  );
};

describe('inspectCrossReferenceTable: cross-reference streams', () => {
  it('finds no residue when every entry is at generation zero', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 4 /Index [ 0 4 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [1, 15, 0],
          [1, 90, 0],
          [1, 300, 0],
        ],
      }),
    );

    expect(result.status).toBe('VALID');
    expect(result.entryCount).toBe(4);
    expect(result.reason).toContain('generation zero');
  });

  it('names every in-use entry above generation zero', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 4 /Index [ 0 4 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [1, 15, 0],
          [1, 90, 1],
          [1, 300, 3],
        ],
      }),
    );

    expect(result.status).toBe('RESIDUE');
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([2, 3]);
  });

  // A type-2 entry's third field is its index inside an object stream, not a
  // generation. Reading it as one would accuse every compressed document.
  it('does not mistake an object stream index for a generation', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 3 /Index [ 0 3 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [2, 9, 4],
          [2, 9, 7],
        ],
      }),
    );

    expect(result.status).toBe('VALID');
  });

  // The head of the free list carries generation 65535 by convention.
  it('ignores the generation on a free entry', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [0, 0, 12],
        ],
      }),
    );

    expect(result.status).toBe('VALID');
  });

  it('reads several /Index subsections in order', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 51 /Index [ 0 2 50 1 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [1, 15, 0],
          [1, 90, 1],
        ],
      }),
    );

    expect(result.status).toBe('RESIDUE');
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([50]);
  });

  it('treats an absent /Index as the default of [0 /Size]', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [1, 15, 1],
        ],
      }),
    );

    expect(result.status).toBe('RESIDUE');
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([1]);
  });

  // A width of zero means the field is omitted; the type field then defaults
  // to 1, so those entries are in use and must still be read.
  it('applies the default type when /W omits the type field', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ] /W [0 2 1]',
        entries: [
          [null, 15, 0],
          [null, 90, 1],
        ],
        widths: [0, 2, 1],
      }),
    );

    expect(result.status).toBe('RESIDUE');
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([1]);
  });

  it('inflates a FlateDecode stream', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary:
          '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] /Filter /FlateDecode',
        entries: [
          [0, 0, 255],
          [1, 15, 1],
        ],
        flate: true,
      }),
    );

    expect(result.status).toBe('RESIDUE');
    expect(result.residue.map(entry => entry.objectNumber)).toEqual([1]);
  });

  it('reads a filter written as a one-element array', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary:
          '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] /Filter [ /FlateDecode ]',
        entries: [
          [0, 0, 255],
          [1, 15, 0],
        ],
        flate: true,
      }),
    );

    expect(result.status).toBe('VALID');
  });

  it('falls back to endstream when the dictionary declares no /Length', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1]',
        entries: [
          [0, 0, 255],
          [1, 15, 1],
        ],
        omitLength: true,
      }),
    );

    expect(result.status).toBe('RESIDUE');
  });

  describe('PNG predictors', () => {
    // Producers commonly apply one to make the stream compress better. Each
    // row names the filter used for it, so all five have to be undone.
    it.each([0, 1, 2, 3, 4])('undoes row filter %i', predictorFilter => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 3 /Index [ 0 3 ] /W [1 2 1] ' +
            '/Filter /FlateDecode /DecodeParms << /Predictor 12 /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 0],
            [1, 90, 1],
          ],
          flate: true,
          predictorFilter,
        }),
      );

      expect(result.status).toBe('RESIDUE');
      expect(result.residue.map(entry => entry.objectNumber)).toEqual([2]);
    });

    // The Paeth predictor picks whichever of the three neighbours the
    // gradient estimate lands closest to, and these bytes are chosen so it
    // reaches for the one diagonally above and left.
    it('undoes a Paeth row that predicts from the upper-left neighbour', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 /Columns 4 >>',
          entries: [
            [0, 100, 200],
            [1, 10, 1],
          ],
          predictorFilter: 4,
        }),
      );

      expect(result.status).toBe('RESIDUE');
      expect(result.residue.map(entry => entry.objectNumber)).toEqual([1]);
    });

    it('defaults /Columns to one when the parameters omit it', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
          predictorColumns: 1,
          predictorFilter: 2,
        }),
      );

      expect(result.status).toBe('RESIDUE');
    });

    it('cannot judge an unknown row filter', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
          predictorFilter: 9,
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
      expect(result.reason).toContain('could not be decoded');
    });

    it('cannot judge rows that do not fill the declared columns', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 /Columns 3 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
          predictorFilter: 0,
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
    });

    it('ignores /DecodeParms that declare no predictor', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
        }),
      );

      expect(result.status).toBe('RESIDUE');
    });

    it('cannot judge a predictor it does not undo faithfully', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 2 /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
    });

    it('cannot judge a predictor at more than one colour', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 /Colors 3 /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
          predictorFilter: 0,
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
    });

    it('cannot judge a predictor at a bit depth other than eight', () => {
      const result = inspectCrossReferenceSection(
        crossReferenceStream({
          dictionary:
            '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] ' +
            '/DecodeParms << /Predictor 12 /BitsPerComponent 4 /Columns 4 >>',
          entries: [
            [0, 0, 255],
            [1, 15, 1],
          ],
          predictorFilter: 0,
        }),
      );

      expect(result.status).toBe('INDETERMINATE');
    });
  });

  it('cannot judge a filter it cannot undo', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary:
          '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] /Filter /LZWDecode',
        entries: [
          [0, 0, 255],
          [1, 15, 1],
        ],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('could not be decoded');
  });

  it('cannot judge data that does not inflate', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary:
          '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] /Filter /FlateDecode',
        entries: [
          [0, 0, 255],
          [1, 15, 1],
        ],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
  });

  it('cannot judge a stream with no /W', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('no valid /W');
  });

  it('cannot judge a stream whose /W has too few fields', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('/W and /Index');
  });

  it('cannot judge a stream whose /W is entirely zero', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 2 ] /W [0 0 0]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
  });

  it('cannot judge a malformed /Index', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 10 /Index [ 0 4 6 ] /W [1 2 1]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('/W and /Index');
  });

  it('cannot judge a non-numeric /Index', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 2 /Index [ 0 x ] /W [1 2 1]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
  });

  it('cannot judge an /Index that runs past the entry data', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /Size 9 /Index [ 0 9 ] /W [1 2 1]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('/W and /Index');
  });

  it('cannot judge a stream that declares neither /Index nor /Size', () => {
    const result = inspectCrossReferenceSection(
      crossReferenceStream({
        dictionary: '/Type /XRef /W [1 2 1]',
        entries: [[0, 0, 255]],
      }),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('neither /Index nor /Size');
  });

  it('cannot judge a stream keyword with no end-of-line after it', () => {
    const body = '%PDF-1.7\n';
    const result = inspectCrossReferenceTable(
      bytes(
        `${body}9 0 obj\n<< /Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] >>\n` +
          `streamstartxref\n${body.length}\n%%EOF\n`,
      ),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('could not be decoded');
  });

  it('cannot judge a stream with no endstream keyword', () => {
    const result = inspectCrossReferenceTable(
      withStartxref(
        '%PDF-1.7\n',
        '9 0 obj\n<< /Type /XRef /Size 2 /Index [ 0 2 ] /W [1 2 1] >>\nstream\n',
      ),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('could not be decoded');
  });

  it('cannot judge a startxref that points at something other than an object', () => {
    const result = inspectCrossReferenceTable(
      withStartxref('%PDF-1.7\n', 'not a cross-reference at all\n'),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('does not point at');
  });

  it('cannot judge an object that is not a cross-reference stream', () => {
    const result = inspectCrossReferenceTable(
      withStartxref(
        '%PDF-1.7\n',
        '9 0 obj\n<< /Type /ObjStm /N 4 >>\nstream\n',
      ),
    );

    expect(result.status).toBe('INDETERMINATE');
    expect(result.reason).toContain('does not point at');
  });
});
