/**
 * Builds a synthetic source document carrying the precondition for the
 * cross-reference defect, so an ingest pipeline can be tested end to end.
 *
 * The output is a **valid** PDF. It is an incrementally updated document: the
 * original revision, followed by an appended revision that supersedes the
 * catalog at a raised generation number. Every conforming reader — Adobe
 * included — follows the last cross-reference section, resolves `/Root` to the
 * new generation, and ignores the superseded copy still sitting in the file.
 * That is ordinary, and it is what an Acrobat "Save" produces.
 *
 * pdf-lib is the odd one out. `PDFParser.parseDocument` scans the whole file
 * for `N G obj` headers rather than following the cross-reference table, so it
 * registers *both* copies as distinct objects. Its writer then emits both rows
 * under one object number, the subsection count overshoots, and every row
 * after the duplicate is attributed to the wrong object.
 *
 * A document built here should therefore open cleanly before a pipeline
 * touches it and be damaged afterwards. That difference is the point: it
 * isolates the pipeline as the variable.
 */

/** Width, in bytes, of a conforming classic cross-reference row. */
const CLASSIC_ENTRY_WIDTH = 20;

const decodeLatin1 = (bytes: Uint8Array): string => {
  const chunkSize = 10000;
  let result = '';
  for (let index = 0; index < bytes.length; index += chunkSize) {
    result += String.fromCharCode(
      ...bytes.subarray(index, Math.min(index + chunkSize, bytes.length)),
    );
  }

  return result;
};

const encodeLatin1 = (text: string): Uint8Array =>
  Uint8Array.from(text, character => character.charCodeAt(0) & 0xff);

/**
 * One conforming twenty-byte cross-reference row.
 *
 * A reader locates row *n* by multiplying, so a row of the wrong width shifts
 * every row after it — the very defect this fixture exists to reproduce.
 * Getting that wrong here would produce a fixture broken for the wrong reason,
 * so the width is asserted rather than assumed.
 */
export const crossReferenceRow = (
  offset: number,
  generation: number,
  type: 'f' | 'n',
): string => {
  const text = `${String(offset).padStart(10, '0')} ${String(generation).padStart(5, '0')} ${type} \n`;
  if (text.length !== CLASSIC_ENTRY_WIDTH) {
    throw new Error(`cross-reference row is ${text.length} bytes, not 20`);
  }

  return text;
};

export type SupersededRevision = {
  /** The object number now present at two generations. */
  objectNumber: number;
  /** The generation the appended revision introduces. */
  supersedingGeneration: number;
};

/**
 * Appends a revision superseding the document catalog at a raised generation,
 * leaving the original copy in place as a conforming incremental update does.
 *
 * The superseding body is copied verbatim from the original catalog, so the
 * document renders identically before and after.
 */
export const appendSupersededCatalogRevision = (
  pdfBytes: Uint8Array,
): { bytes: Uint8Array; revision: SupersededRevision } => {
  const original = decodeLatin1(pdfBytes);

  const startxref = /startxref\s+(\d+)\s*%%EOF\s*$/.exec(original);
  if (!startxref) {
    throw new Error('the source document has no startxref to chain from');
  }
  const previousOffset = Number(startxref[1]);

  const trailerIndex = original.lastIndexOf('trailer');
  const trailer =
    trailerIndex === -1
      ? original
      : original.slice(trailerIndex, startxref.index);

  const root = /\/Root\s+(\d+)\s+(\d+)\s+R/.exec(trailer);
  if (!root) {
    throw new Error('the source document declares no /Root');
  }
  const objectNumber = Number(root[1]);
  const generation = Number(root[2]);

  const catalog = new RegExp(
    `(?:^|[^0-9])${objectNumber}\\s+${generation}\\s+obj([\\s\\S]*?)endobj`,
  ).exec(original);
  if (!catalog) {
    throw new Error(
      `no body found for the catalog at ${objectNumber} ${generation} obj`,
    );
  }

  const size = /\/Size\s+(\d+)/.exec(trailer);
  const id = /\/ID\s*\[[^\]]*\]/.exec(trailer);
  const supersedingGeneration = generation + 1;

  // Offsets are absolute from the start of the file, so the body has to be
  // placed before the row that points at it can be written.
  const prefix = original.endsWith('\n') ? '' : '\n';
  const bodyOffset = original.length + prefix.length;
  const body = `${objectNumber} ${supersedingGeneration} obj${catalog[1]}endobj\n`;
  const sectionOffset = bodyOffset + body.length;

  const section =
    'xref\n' +
    // Object zero heads the free list, as every classic table requires.
    `0 1\n${crossReferenceRow(0, 65535, 'f')}` +
    `${objectNumber} 1\n${crossReferenceRow(bodyOffset, supersedingGeneration, 'n')}` +
    'trailer\n' +
    `<< /Size ${size ? size[1] : objectNumber + 1} ` +
    `/Root ${objectNumber} ${supersedingGeneration} R ` +
    `/Prev ${previousOffset}${id ? ` ${id[0]}` : ''} >>\n` +
    `startxref\n${sectionOffset}\n%%EOF\n`;

  return {
    bytes: encodeLatin1(original + prefix + body + section),
    revision: { objectNumber, supersedingGeneration },
  };
};
