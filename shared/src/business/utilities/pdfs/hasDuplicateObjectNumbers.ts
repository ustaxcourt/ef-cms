/**
 * Detects the precondition for the cross-reference defect: one object number
 * present in a document at more than one generation.
 *
 * A file carrying it is still valid, and every conforming reader opens it. The
 * damage appears only after pdf-lib re-saves it, because its parser scans the
 * whole file for object headers rather than following the cross-reference
 * table, and its writer then emits both copies under one object number.
 */

const OBJ_KEYWORD = [0x6f, 0x62, 0x6a]; // "obj"

const isDigit = (byte: number): boolean => byte >= 0x30 && byte <= 0x39;

const isPdfWhitespace = (byte: number): boolean =>
  byte === 0x00 ||
  byte === 0x09 ||
  byte === 0x0a ||
  byte === 0x0c ||
  byte === 0x0d ||
  byte === 0x20;

const isRegularCharacter = (byte: number): boolean =>
  !isPdfWhitespace(byte) &&
  ![0x28, 0x29, 0x3c, 0x3e, 0x5b, 0x5d, 0x7b, 0x7d, 0x2f, 0x25].includes(byte);

/** Walks backwards over a run of `predicate` bytes, returning where it starts. */
const scanBackWhile = (
  bytes: Uint8Array,
  from: number,
  predicate: (byte: number) => boolean,
): number => {
  let index = from;
  while (index >= 0 && predicate(bytes[index])) {
    index -= 1;
  }

  return index;
};

/**
 * True when the file contains an indirect object header above generation zero.
 *
 * This is a screen, not a verdict: an ordinary incremental update carries such
 * a header with no collision at all. It is sound as a gate because pdf-lib
 * pools references on object number *and* generation, so two headers sharing a
 * number and a generation collapse into one object and cause no damage. The
 * precondition therefore always involves a raised generation, and a file
 * without one can skip the parse entirely.
 */
export const hasRaisedGenerationHeader = (bytes: Uint8Array): boolean => {
  for (let index = 0; index + OBJ_KEYWORD.length <= bytes.length; index += 1) {
    if (
      bytes[index] !== OBJ_KEYWORD[0] ||
      bytes[index + 1] !== OBJ_KEYWORD[1] ||
      bytes[index + 2] !== OBJ_KEYWORD[2]
    ) {
      continue;
    }

    // Reject "object", "objstm" and the like; the keyword must end here.
    const after = index + OBJ_KEYWORD.length;
    if (after < bytes.length && isRegularCharacter(bytes[after])) {
      continue;
    }

    // "<objectNumber> <generation> obj", read right to left.
    const generationEnd = scanBackWhile(bytes, index - 1, isPdfWhitespace);
    if (generationEnd === index - 1) {
      continue;
    }
    const generationStart = scanBackWhile(bytes, generationEnd, isDigit);
    if (generationStart === generationEnd) {
      continue;
    }
    const numberEnd = scanBackWhile(bytes, generationStart, isPdfWhitespace);
    if (numberEnd === generationStart) {
      continue;
    }
    if (numberEnd === scanBackWhile(bytes, numberEnd, isDigit)) {
      continue;
    }

    for (let digit = generationStart + 1; digit <= generationEnd; digit += 1) {
      if (bytes[digit] !== 0x30) {
        return true;
      }
    }
  }

  return false;
};

/**
 * True when the document holds an object number at more than one generation.
 *
 * Returns false when pdf-lib is unavailable or cannot load the file. That is
 * not a gap: a file pdf-lib cannot load is a file it never rewrites, so the
 * defect cannot be introduced, and rejecting the upload would blame the filer
 * for our own inability to parse.
 */
export const hasDuplicateObjectNumbers = async (
  bytes: Uint8Array,
): Promise<boolean> => {
  if (!hasRaisedGenerationHeader(bytes)) {
    return false;
  }

  let pdfDoc;
  try {
    // Imported lazily so pdf-lib stays out of the main client bundle; the
    // static `getPdfLib` in this directory would pull it in.
    const { PDFDocument } = await import('pdf-lib');
    pdfDoc = await PDFDocument.load(bytes, {
      ignoreEncryption: true,
      throwOnInvalidObject: false,
      updateMetadata: false,
    });
  } catch {
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
