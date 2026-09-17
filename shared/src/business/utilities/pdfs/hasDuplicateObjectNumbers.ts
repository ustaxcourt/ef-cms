/** One object number at two generations: what pdf-lib rewrites into a broken file. */

import type { PDFDocument } from 'pdf-lib';

const OBJ_KEYWORD = [0x6f, 0x62, 0x6a]; // "obj"

const isDigit = (byte: number): boolean => byte >= 0x30 && byte <= 0x39;

const isPdfWhitespace = (byte: number): boolean =>
  byte === 0x00 ||
  byte === 0x09 ||
  byte === 0x0a ||
  byte === 0x0c ||
  byte === 0x0d ||
  byte === 0x20;

const isEndOfLine = (byte: number): boolean => byte === 0x0a || byte === 0x0d;

/** A run of whitespace and comments; several candidate headers may share it. */
interface Separator {
  betweenTokens: boolean;
  inComment: boolean;
}

/** Every candidate header underway, however many overlap. */
interface HeaderScan {
  inObjectNumber: boolean;
  beforeGeneration: Separator;
  inZeroGeneration: boolean;
  inRaisedGeneration: boolean;
  beforeKeyword: Separator;
  keywordBytesMatched: number;
}

/** Moves a separator on by one byte, as pdf-lib's skipWhitespaceAndComments would. */
const advanceSeparator = (
  separator: Separator,
  tokenJustEnded: boolean,
  byte: number,
): void => {
  const open = tokenJustEnded || separator.betweenTokens;
  const endsComment = isEndOfLine(byte);
  separator.betweenTokens =
    isPdfWhitespace(byte) && (open || (separator.inComment && endsComment));
  separator.inComment =
    (byte === 0x25 && open) || (separator.inComment && !endsComment);
};

/** Moves every candidate on by one byte; true once one completes a raised-generation header. */
const advanceHeaderScan = (scan: HeaderScan, byte: number): boolean => {
  // pdf-lib does not check what follows the keyword, so neither do we.
  if (scan.keywordBytesMatched === 2 && byte === OBJ_KEYWORD[2]) {
    return true;
  }

  const keywordMayStart =
    scan.inRaisedGeneration || scan.beforeKeyword.betweenTokens;
  scan.keywordBytesMatched =
    byte === OBJ_KEYWORD[0] && keywordMayStart
      ? 1
      : byte === OBJ_KEYWORD[1] && scan.keywordBytesMatched === 1
        ? 2
        : 0;
  advanceSeparator(scan.beforeKeyword, scan.inRaisedGeneration, byte);

  const generationStillZero =
    scan.beforeGeneration.betweenTokens || scan.inZeroGeneration;
  scan.inRaisedGeneration =
    isDigit(byte) &&
    (scan.inRaisedGeneration || (byte !== 0x30 && generationStillZero));
  scan.inZeroGeneration = byte === 0x30 && generationStillZero;
  advanceSeparator(scan.beforeGeneration, scan.inObjectNumber, byte);
  scan.inObjectNumber = isDigit(byte);

  return false;
};

const isSeparatorIdle = (separator: Separator): boolean =>
  !separator.betweenTokens && !separator.inComment;

const isHeaderScanIdle = (scan: HeaderScan): boolean =>
  !scan.inObjectNumber &&
  !scan.inZeroGeneration &&
  !scan.inRaisedGeneration &&
  scan.keywordBytesMatched === 0 &&
  isSeparatorIdle(scan.beforeGeneration) &&
  isSeparatorIdle(scan.beforeKeyword);

/** Cheap screen using pdf-lib's own header grammar: no raised generation, no collision. */
export const hasRaisedGenerationHeader = (bytes: Uint8Array): boolean => {
  // Follows every candidate header at once, so each byte is read only once.
  const scan: HeaderScan = {
    beforeGeneration: { betweenTokens: false, inComment: false },
    beforeKeyword: { betweenTokens: false, inComment: false },
    inObjectNumber: false,
    inRaisedGeneration: false,
    inZeroGeneration: false,
    keywordBytesMatched: 0,
  };
  let idle = true;

  for (let index = 0; index < bytes.length; index += 1) {
    // With nothing underway, only a digit can start a header.
    if (idle && !isDigit(bytes[index])) {
      continue;
    }
    if (advanceHeaderScan(scan, bytes[index])) {
      return true;
    }
    idle = isHeaderScanIdle(scan);
  }

  return false;
};

/** True when an object number repeats in a file our upload would rewrite. */
export const hasDuplicateObjectNumbers = async (
  bytes: Uint8Array,
  { alreadyScreened = false }: { alreadyScreened?: boolean } = {},
): Promise<boolean> => {
  if (!alreadyScreened && !hasRaisedGenerationHeader(bytes)) {
    return false;
  }

  let pdfDoc: PDFDocument;
  try {
    // Lazy so pdf-lib stays out of the main client bundle.
    const { PDFDocument } = await import('pdf-lib');
    pdfDoc = await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });
  } catch (error) {
    // A file pdf-lib cannot load is a file it never rewrites.
    console.error('Could not load PDF to check for duplicate objects', error);
    return false;
  }

  // cleanFileMetadata leaves encrypted files untouched, so they cannot be broken.
  if (pdfDoc.isEncrypted) {
    return false;
  }

  const seenObjectNumbers = new Set<number>();
  for (const [ref] of pdfDoc.context.enumerateIndirectObjects()) {
    if (seenObjectNumbers.has(ref.objectNumber)) {
      return true;
    }
    seenObjectNumbers.add(ref.objectNumber);
  }

  return false;
};
