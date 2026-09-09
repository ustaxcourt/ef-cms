/** One object number at two generations: what pdf-lib rewrites into a broken file. */

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

/** Walks back over a run of `predicate` bytes, returning the index just before it. */
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

/** Cheap screen: no header above generation zero means no collision is possible. */
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

/** True when an object number repeats; a file pdf-lib cannot load counts as false. */
export const hasDuplicateObjectNumbers = async (
  bytes: Uint8Array,
): Promise<boolean> => {
  if (!hasRaisedGenerationHeader(bytes)) {
    return false;
  }

  let pdfDoc;
  try {
    // Lazy so pdf-lib stays out of the main client bundle.
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
