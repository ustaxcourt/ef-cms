import { createHash } from 'crypto';
import { inflateRawSync, inflateSync } from 'zlib';

/**
 * Proves whether a repair altered document content.
 *
 * A cross-reference repair rewrites the document's structure, so byte-level
 * comparison of the files says nothing useful. What matters is whether the
 * *content* survived: every decoded content stream is hashed and the two
 * multisets of hashes are compared. Structural objects — cross-reference
 * streams and object streams — are excluded, because reorganising them is
 * exactly what a repair is supposed to do.
 *
 * Hashes are reported rather than stream data, so a comparison can be shared
 * without disclosing the contents of the document.
 */

export type PdfAnalysis = {
  hashes: string[];
  hasAcroForm: boolean;
  hasEncryption: boolean;
  hasSignature: boolean;
  hasXfa: boolean;
  objectStreamCount: number;
  size: number;
  typeCounts: Record<string, number>;
  undecodable: number[];
};

export type PdfComparison = {
  byteIdenticalStreams: number;
  onlyInOriginal: number;
  onlyInRepaired: number;
  pageCountChanged: boolean;
  sharesNoContent: boolean;
  verdict: string;
  warnings: string[];
};

/**
 * Decodes an ASCII85 stream. A filter chain such as
 * `/Filter [ /ASCII85Decode /FlateDecode ]` must be unwrapped in order, and
 * feeding ASCII85 text straight to zlib reports a healthy object as damaged.
 */
export const decodeAscii85 = (input: Buffer): Buffer => {
  let text = input.toString('latin1');

  const open = text.indexOf('<~');
  if (open !== -1) {
    text = text.slice(open + 2);
  }
  const close = text.indexOf('~>');
  if (close !== -1) {
    text = text.slice(0, close);
  }
  text = text.replace(/\s/g, '');

  const bytes: number[] = [];
  let accumulator = 0;
  let count = 0;

  for (const character of text) {
    if (character === 'z' && count === 0) {
      bytes.push(0, 0, 0, 0);
      continue;
    }
    const value = character.charCodeAt(0) - 33;
    if (value < 0 || value > 84) {
      continue;
    }
    accumulator = accumulator * 85 + value;
    count += 1;
    if (count === 5) {
      bytes.push(
        (accumulator >>> 24) & 255,
        (accumulator >>> 16) & 255,
        (accumulator >>> 8) & 255,
        accumulator & 255,
      );
      accumulator = 0;
      count = 0;
    }
  }

  // A partial final group is padded with the maximum digit, and one fewer byte
  // than digits is emitted.
  if (count > 0) {
    for (let pad = count; pad < 5; pad++) {
      accumulator = accumulator * 85 + 84;
    }
    const quad = [
      (accumulator >>> 24) & 255,
      (accumulator >>> 16) & 255,
      (accumulator >>> 8) & 255,
      accumulator & 255,
    ];
    for (let index = 0; index < count - 1; index++) {
      bytes.push(quad[index]);
    }
  }

  return Buffer.from(bytes);
};

/** Byte offset and object number of every top-level object header. */
const findObjectHeaders = (text: string): [number, number][] => {
  const headers: [number, number][] = [];
  const pattern = /(?:^|[\s>])(\d+)\s+(\d+)\s+obj\b/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const keyword = `${match[1]} ${match[2]} obj`;
    headers.push([
      match.index + (match[0].length - keyword.length),
      Number(match[1]),
    ]);
  }

  return headers;
};

/**
 * Object numbers whose entire body is a single integer, so that an indirect
 * `/Length 3 0 R` can be resolved. Without this the object number is misread
 * as the length and the stream is truncated.
 */
const findIntegerObjects = (text: string): Map<number, number> => {
  const integers = new Map<number, number>();
  const pattern = /(?:^|[\s>])(\d+)\s+(\d+)\s+obj\s+(\d+)\s*endobj/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    integers.set(Number(match[1]), Number(match[3]));
  }

  return integers;
};

const countObjectStreamTypes = (
  data: Buffer,
  dictionary: string,
  bump: (type: string) => void,
): void => {
  const first = Number(/\/First\s+(\d+)/.exec(dictionary)?.[1] ?? 0);
  const total = Number(/\/N\s+(\d+)/.exec(dictionary)?.[1] ?? 0);
  const pairs = data
    .subarray(0, first)
    .toString('latin1')
    .trim()
    .split(/\s+/)
    .map(Number);

  for (
    let index = 0;
    index < total * 2 && index + 1 < pairs.length;
    index += 2
  ) {
    const start = first + pairs[index + 1];
    const end =
      index + 2 < total * 2 && index + 3 < pairs.length
        ? first + pairs[index + 3]
        : data.length;
    const type = /\/Type\s*\/(\w+)/.exec(
      data.subarray(start, end).toString('latin1'),
    );
    if (type) {
      bump(type[1]);
    }
  }
};

/**
 * Resolves a stream's declared length, unwraps its filter chain, and returns
 * the decoded bytes. Returns null when the stream cannot be decoded.
 */
const decodeStream = ({
  buffer,
  dataEnd,
  dataStart,
  dictionary,
  integers,
}: {
  buffer: Buffer;
  dataEnd: number;
  dataStart: number;
  dictionary: string;
  integers: Map<number, number>;
}): Buffer | null => {
  let length: number | null = null;
  const indirect = /\/Length\s+(\d+)\s+(\d+)\s+R\b/.exec(dictionary);
  if (indirect) {
    length = integers.get(Number(indirect[1])) ?? null;
  } else {
    const direct = /\/Length\s+(\d+)\b/.exec(dictionary);
    length = direct ? Number(direct[1]) : null;
  }

  let raw = buffer.subarray(
    dataStart,
    length !== null && dataStart + length <= buffer.length
      ? dataStart + length
      : dataEnd,
  );
  if (/ASCII85Decode/.test(dictionary)) {
    raw = decodeAscii85(raw);
  }

  if (!/FlateDecode/.test(dictionary)) {
    return raw;
  }

  try {
    return inflateSync(raw);
  } catch {
    try {
      return inflateRawSync(raw);
    } catch {
      return null;
    }
  }
};

/** Byte range of an object's stream data, or null when it has no stream. */
const locateStream = (
  text: string,
  bodyStart: number,
  bodyEnd: number,
): { dataEnd: number; dataStart: number; dictionary: string } | null => {
  const body = text.slice(bodyStart, bodyEnd);
  const keyword = /\bstream[ \t]*\r?\n/.exec(body);
  if (!keyword) {
    return null;
  }

  const keywordIndex = body.indexOf(keyword[0]);
  const endIndex = body.indexOf('endstream', keywordIndex);
  if (endIndex === -1) {
    return null;
  }

  const dataStart = bodyStart + keywordIndex + keyword[0].length;
  let dataEnd = bodyStart + endIndex;
  while (
    dataEnd > dataStart &&
    (text[dataEnd - 1] === '\n' || text[dataEnd - 1] === '\r')
  ) {
    dataEnd -= 1;
  }

  return { dataEnd, dataStart, dictionary: body.slice(0, keywordIndex) };
};

export const analyzePdf = (buffer: Buffer): PdfAnalysis => {
  const text = buffer.toString('latin1');
  const headers = findObjectHeaders(text);
  const integers = findIntegerObjects(text);

  const typeCounts: Record<string, number> = {};
  const hashes: string[] = [];
  const undecodable: number[] = [];
  let objectStreamCount = 0;

  const bump = (type: string): void => {
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  };

  for (let index = 0; index < headers.length; index++) {
    const bodyStart = headers[index][0];
    const bodyEnd =
      index + 1 < headers.length ? headers[index + 1][0] : text.length;

    const located = locateStream(text, bodyStart, bodyEnd);
    const dictionary = located
      ? located.dictionary
      : text.slice(bodyStart, bodyEnd);

    const type = /\/Type\s*\/(\w+)/.exec(dictionary);
    if (type) {
      bump(type[1]);
    }
    if (!located) {
      continue;
    }

    const data = decodeStream({ buffer, ...located, integers });
    if (data === null) {
      undecodable.push(headers[index][1]);
      continue;
    }

    if (/\/Type\s*\/(ObjStm|XRef)/.test(dictionary)) {
      if (/ObjStm/.test(dictionary)) {
        objectStreamCount += 1;
        countObjectStreamTypes(data, dictionary, bump);
      }
      // Structural objects are what a repair reorganises, so they are excluded
      // from the content comparison.
      continue;
    }

    hashes.push(createHash('sha256').update(data).digest('hex'));
  }

  const present = (keyword: string): boolean =>
    new RegExp(`\\/${keyword}\\b`).test(text);

  return {
    hashes,
    hasAcroForm: present('AcroForm'),
    hasEncryption: present('Encrypt'),
    hasSignature: /\/Type\s*\/Sig\b|\/ByteRange/.test(text),
    hasXfa: present('XFA'),
    objectStreamCount,
    size: buffer.length,
    typeCounts,
    undecodable,
  };
};

const countByHash = (hashes: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const hash of hashes) {
    counts.set(hash, (counts.get(hash) || 0) + 1);
  }

  return counts;
};

const buildVerdict = ({
  onlyInOriginal,
  onlyInRepaired,
  originalPages,
  pageCountChanged,
  repairedPages,
  sharesNoContent,
}: {
  onlyInOriginal: number;
  onlyInRepaired: number;
  originalPages: number;
  pageCountChanged: boolean;
  repairedPages: number;
  sharesNoContent: boolean;
}): string => {
  if (sharesNoContent) {
    return 'these files share no content streams at all - they are almost certainly two different documents, and nothing else here is meaningful';
  }
  if (pageCountChanged) {
    return `page count changed from ${originalPages} to ${repairedPages} - do NOT trust this repair`;
  }
  if (onlyInRepaired > 0) {
    return `${onlyInRepaired} stream(s) exist only in the repaired file - content was invented, investigate`;
  }
  if (onlyInOriginal === 0) {
    return 'every content stream is byte-identical and the page count matches - no document content was altered';
  }

  return `page count matches and nothing was added, but ${onlyInOriginal} stream(s) were dropped - expected when the original carried superseded revisions, since those objects are unreachable and no reader was rendering them`;
};

const buildWarnings = (
  original: PdfAnalysis,
  repaired: PdfAnalysis,
): string[] => {
  const warnings: string[] = [];

  if (original.hasSignature && !repaired.hasSignature) {
    warnings.push(
      'a digital signature in the original is gone from the repaired file',
    );
  } else if (original.hasSignature && repaired.hasSignature) {
    warnings.push(
      're-serialising a signed document almost certainly invalidates the signature',
    );
  }
  if (original.hasEncryption && !repaired.hasEncryption) {
    warnings.push('the original was encrypted and the repaired file is not');
  }
  if (original.hasAcroForm && !repaired.hasAcroForm) {
    warnings.push(
      'the original had form fields (/AcroForm) and the repaired file does not',
    );
  }
  if (original.hasXfa && !repaired.hasXfa) {
    warnings.push(
      'the original had an XFA form and the repaired file does not',
    );
  }

  return warnings;
};

export const comparePdfs = (
  original: PdfAnalysis,
  repaired: PdfAnalysis,
): PdfComparison => {
  const inOriginal = countByHash(original.hashes);
  const inRepaired = countByHash(repaired.hashes);

  let byteIdenticalStreams = 0;
  let onlyInOriginal = 0;
  let onlyInRepaired = 0;

  for (const [hash, count] of inOriginal) {
    const other = inRepaired.get(hash) || 0;
    byteIdenticalStreams += Math.min(count, other);
    onlyInOriginal += Math.max(0, count - other);
  }
  for (const [hash, count] of inRepaired) {
    const other = inOriginal.get(hash) || 0;
    onlyInRepaired += Math.max(0, count - other);
  }

  const originalPages = original.typeCounts.Page || 0;
  const repairedPages = repaired.typeCounts.Page || 0;
  const pageCountChanged = originalPages !== repairedPages;

  // Two files that share no content at all are not a document and its repair.
  const sharesNoContent =
    byteIdenticalStreams === 0 &&
    original.hashes.length > 0 &&
    repaired.hashes.length > 0;

  const verdict = buildVerdict({
    onlyInOriginal,
    onlyInRepaired,
    originalPages,
    pageCountChanged,
    repairedPages,
    sharesNoContent,
  });
  const warnings = buildWarnings(original, repaired);

  return {
    byteIdenticalStreams,
    onlyInOriginal,
    onlyInRepaired,
    pageCountChanged,
    sharesNoContent,
    verdict,
    warnings,
  };
};
