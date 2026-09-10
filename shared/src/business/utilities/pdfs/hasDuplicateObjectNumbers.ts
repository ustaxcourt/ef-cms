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

const skipDigits = (bytes: Uint8Array, from: number): number => {
  let index = from;
  while (index < bytes.length && isDigit(bytes[index])) {
    index += 1;
  }

  return index;
};

/** Mirrors pdf-lib's skipWhitespaceAndComments: a comment runs to end of line. */
const skipWhitespaceAndComments = (bytes: Uint8Array, from: number): number => {
  let index = from;
  while (index < bytes.length) {
    if (isPdfWhitespace(bytes[index])) {
      index += 1;
    } else if (bytes[index] === 0x25) {
      while (index < bytes.length && !isEndOfLine(bytes[index])) {
        index += 1;
      }
    } else {
      break;
    }
  }

  return index;
};

/** Cheap screen using pdf-lib's own header grammar: no raised generation, no collision. */
export const hasRaisedGenerationHeader = (bytes: Uint8Array): boolean => {
  for (let index = 0; index < bytes.length; index += 1) {
    // Try each digit run once, from its first digit, as an object number.
    if (!isDigit(bytes[index]) || (index > 0 && isDigit(bytes[index - 1]))) {
      continue;
    }

    const generationStart = skipWhitespaceAndComments(
      bytes,
      skipDigits(bytes, index),
    );
    const generationEnd = skipDigits(bytes, generationStart);
    if (generationEnd === generationStart) {
      continue;
    }

    // pdf-lib does not check what follows the keyword, so neither do we.
    const keyword = skipWhitespaceAndComments(bytes, generationEnd);
    if (
      bytes[keyword] !== OBJ_KEYWORD[0] ||
      bytes[keyword + 1] !== OBJ_KEYWORD[1] ||
      bytes[keyword + 2] !== OBJ_KEYWORD[2]
    ) {
      continue;
    }

    for (let digit = generationStart; digit < generationEnd; digit += 1) {
      if (bytes[digit] !== 0x30) {
        return true;
      }
    }
  }

  return false;
};

/** True when an object number repeats; a file pdf-lib cannot load counts as false. */
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

  const seenObjectNumbers = new Set<number>();
  for (const [ref] of pdfDoc.context.enumerateIndirectObjects()) {
    if (seenObjectNumbers.has(ref.objectNumber)) {
      return true;
    }
    seenObjectNumbers.add(ref.objectNumber);
  }

  return false;
};
