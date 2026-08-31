import { inflateRawSync, inflateSync } from 'zlib';

/**
 * Decoding a cross-reference section into rows, in either of the two forms a
 * PDF may write it: a classic table of fixed-width text entries, or a
 * compressed cross-reference stream.
 *
 * This module only reads. Deciding what the rows mean is
 * `crossReference.helpers.ts`, which is where the defect is judged.
 *
 * Every reader returns null rather than guessing when a section cannot be
 * walked or decoded faithfully, because a misparse would produce a false
 * accusation against a sound document.
 */

/** One row of a cross-reference section, whichever form it took. */
export type CrossReferenceEntry = {
  generationNumber: number;
  objectNumber: number;
  /** Byte offset for an in-use entry; the containing stream for a type-2. */
  offset: number;
  /**
   * Which subsection the row belongs to. A duplicate displaces only the rows
   * that follow it *within its own subsection*, because the next subsection
   * declares a fresh starting object number and re-anchors the numbering.
   */
  subsection: number;
  /** 0 free, 1 in use, 2 stored inside an object stream. */
  type: number;
};

/**
 * Number of trailing bytes searched for the `startxref` keyword. The PDF
 * specification places it within the final kilobyte, ahead of `%%EOF`.
 *
 * Exported so a caller reading from remote storage knows how small a tail it
 * can request instead of transferring a whole document.
 */
export const START_XREF_SCAN_BYTES = 2048;

/** Width, in bytes, of a conforming classic cross-reference entry. */
const CLASSIC_ENTRY_WIDTH = 20;
/**
 * Decodes bytes as latin1, where one byte maps to one character. PDF syntax is
 * byte oriented, so a length-preserving decode keeps string offsets and byte
 * offsets interchangeable. `TextDecoder('latin1')` is unsuitable because it
 * resolves to windows-1252 and remaps the 0x80–0x9F range.
 */
export const decodeLatin1 = (
  bytes: Uint8Array,
  start: number,
  end: number = bytes.length,
): string => {
  const chunkSize = 10000;
  let result = '';
  for (let index = start; index < end; index += chunkSize) {
    const chunkEnd = Math.min(index + chunkSize, end);
    result += String.fromCharCode(...bytes.subarray(index, chunkEnd));
  }

  return result;
};

export const readDictionaryInteger = (
  dictionary: string,
  name: string,
): number | null => {
  const match = new RegExp(`/${name}\\s+(\\d+)(?![\\d.])`).exec(dictionary);

  return match ? Number(match[1]) : null;
};

export const readIntegerArray = (
  dictionary: string,
  name: string,
): number[] | null => {
  const match = new RegExp(`/${name}\\s*\\[([^\\]]*)\\]`).exec(dictionary);
  if (!match) {
    return null;
  }

  const numbers = match[1].trim().split(/\s+/).filter(Boolean).map(Number);

  return numbers.length && !numbers.some(isNaN) ? numbers : null;
};
/**
 * Reads every entry of a classic cross-reference table, which must be supplied
 * without its trailer. Returns null when the table cannot be walked — an
 * unreadable subsection header, or entries that are not the conforming width —
 * since a misparse would produce a false accusation.
 */
export const readClassicEntries = (
  section: string,
): CrossReferenceEntry[] | null => {
  let cursor = section.indexOf('xref') + 'xref'.length;
  const entries: CrossReferenceEntry[] = [];
  let subsection = 0;

  for (;;) {
    const remainder = section.slice(cursor);
    // The trailer has already been sliced away, so running out of subsections
    // means the table is complete.
    if (!remainder.trim()) {
      return entries;
    }

    const header = /^\s*(\d+)[^\S\n\r]+(\d+)[^\S\n\r]*(\r\n|\r|\n)/.exec(
      remainder,
    );
    if (!header) {
      return null;
    }

    const firstObjectNumber = Number(header[1]);
    const entryCount = Number(header[2]);
    cursor += header[0].length;
    if (cursor + entryCount * CLASSIC_ENTRY_WIDTH > section.length) {
      return null;
    }

    for (let index = 0; index < entryCount; index += 1) {
      const start = cursor + index * CLASSIC_ENTRY_WIDTH;
      const row = /^(\d{10}) (\d{5}) ([nf])/.exec(
        section.slice(start, start + CLASSIC_ENTRY_WIDTH),
      );
      if (!row) {
        return null;
      }

      entries.push({
        generationNumber: Number(row[2]),
        objectNumber: firstObjectNumber + index,
        offset: Number(row[1]),
        subsection,
        type: row[3] === 'n' ? 1 : 0,
      });
    }

    cursor += entryCount * CLASSIC_ENTRY_WIDTH;
    subsection += 1;
  }
};

/**
 * Undoes a PNG predictor, which producers commonly apply to a cross-reference
 * stream to make it compress better. Each row is prefixed with the filter type
 * used for it. Returns null for anything it cannot undo faithfully.
 *
 * Cross-reference stream data is one colour at eight bits, so the "pixel"
 * ahead of the current byte is the byte immediately to its left.
 */
const undoPngPredictor = (
  data: Uint8Array,
  columns: number,
): Uint8Array | null => {
  const rowWidth = columns + 1;
  if (columns <= 0 || data.length % rowWidth !== 0) {
    return null;
  }

  const rowCount = data.length / rowWidth;
  const output = new Uint8Array(rowCount * columns);

  for (let row = 0; row < rowCount; row += 1) {
    const filter = data[row * rowWidth];
    const source = row * rowWidth + 1;
    const target = row * columns;
    const above = target - columns;

    for (let column = 0; column < columns; column += 1) {
      const raw = data[source + column];
      const left = column ? output[target + column - 1] : 0;
      const up = row ? output[above + column] : 0;
      const upperLeft = row && column ? output[above + column - 1] : 0;
      let value: number;

      if (filter === 0) {
        value = raw;
      } else if (filter === 1) {
        value = raw + left;
      } else if (filter === 2) {
        value = raw + up;
      } else if (filter === 3) {
        value = raw + ((left + up) >> 1);
      } else if (filter === 4) {
        const estimate = left + up - upperLeft;
        const fromLeft = Math.abs(estimate - left);
        const fromUp = Math.abs(estimate - up);
        const fromUpperLeft = Math.abs(estimate - upperLeft);
        value =
          raw +
          (fromLeft <= fromUp && fromLeft <= fromUpperLeft
            ? left
            : fromUp <= fromUpperLeft
              ? up
              : upperLeft);
      } else {
        return null;
      }

      output[target + column] = value & 0xff;
    }
  }

  return output;
};

/** Inflates FlateDecode data, tolerating a missing zlib wrapper. */
const inflate = (data: Uint8Array): Uint8Array | null => {
  try {
    return new Uint8Array(inflateSync(data));
  } catch {
    try {
      return new Uint8Array(inflateRawSync(data));
    } catch {
      return null;
    }
  }
};

/**
 * Recovers a cross-reference stream's decoded bytes. Returns null when the
 * stream uses a filter or predictor this cannot undo, so that an
 * undecodable stream is reported as unknown rather than as sound.
 */
export const decodeCrossReferenceStreamData = (
  sectionBytes: Uint8Array,
  section: string,
  dictionary: string,
): Uint8Array | null => {
  const keyword = /stream(\r\n|\r|\n)/.exec(section);
  if (!keyword) {
    return null;
  }

  const start = keyword.index + keyword[0].length;
  const declaredLength = readDictionaryInteger(dictionary, 'Length');
  const endstream = section.indexOf('endstream', start);
  const end =
    declaredLength !== null && start + declaredLength <= sectionBytes.length
      ? start + declaredLength
      : endstream;
  if (end === -1 || end < start) {
    return null;
  }

  const raw = sectionBytes.subarray(start, end);
  const filter = /\/Filter\s*(\/\w+|\[\s*\/\w+\s*\])/.exec(dictionary);
  let data: Uint8Array | null = raw;

  if (filter) {
    if (!/FlateDecode/.test(filter[1])) {
      return null;
    }
    data = inflate(raw);
  }
  if (!data) {
    return null;
  }

  const parms = /\/DecodeParms\s*<<([\s\S]*?)>>/.exec(dictionary);
  if (!parms) {
    return data;
  }

  const predictor = readDictionaryInteger(parms[1], 'Predictor') ?? 1;
  if (predictor <= 1) {
    return data;
  }
  // Only the PNG predictors apply to a cross-reference stream, and only at the
  // one-colour eight-bit defaults this undoes faithfully.
  if (
    predictor < 10 ||
    (readDictionaryInteger(parms[1], 'Colors') ?? 1) !== 1 ||
    (readDictionaryInteger(parms[1], 'BitsPerComponent') ?? 8) !== 8
  ) {
    return null;
  }

  return undoPngPredictor(
    data,
    readDictionaryInteger(parms[1], 'Columns') ?? 1,
  );
};

/**
 * Reads every entry of a cross-reference stream. `/W` gives each field's width
 * in bytes, and `/Index` pairs a first object number with a count, defaulting
 * to the whole document when absent. A width of zero means the field is
 * omitted and takes its default, which for the type field is 1.
 */
export const readCrossReferenceStreamEntries = (
  data: Uint8Array,
  widths: number[],
  index: number[],
): CrossReferenceEntry[] | null => {
  const recordWidth = widths.reduce((total, width) => total + width, 0);
  if (widths.length < 3 || recordWidth <= 0 || index.length % 2 !== 0) {
    return null;
  }

  const entries: CrossReferenceEntry[] = [];
  let cursor = 0;

  const readField = (position: number, width: number, fallback: number) => {
    let value = 0;
    for (let step = 0; step < width; step += 1) {
      value = value * 256 + data[position + step];
    }

    return width ? value : fallback;
  };

  for (let pair = 0; pair < index.length; pair += 2) {
    for (let step = 0; step < index[pair + 1]; step += 1) {
      if (cursor + recordWidth > data.length) {
        return null;
      }

      const type = readField(cursor, widths[0], 1);
      const second = readField(cursor + widths[0], widths[1], 0);
      const third = readField(cursor + widths[0] + widths[1], widths[2], 0);

      entries.push({
        // A type-2 entry's third field is an index into an object stream, not
        // a generation; such objects are always at generation zero.
        generationNumber: type === 2 ? 0 : third,
        objectNumber: index[pair] + step,
        offset: second,
        subsection: pair / 2,
        type,
      });
      cursor += recordWidth;
    }
  }

  return entries;
};
