import type { SaveOptions } from 'pdf-lib';

/**
 * Options for every `PDFDocument.save()` call whose output is stored as a
 * document of record or otherwise opened by a user in a PDF reader.
 *
 * pdf-lib defaults to `useObjectStreams: true`, which serializes the document
 * with compressed object streams and a cross-reference *stream*. Lenient
 * parsers — PDFium (Chrome, Android, Edge on macOS) and pdf.js — silently
 * rebuild a damaged cross-reference table by rescanning the file for object
 * headers, so they render that output regardless of its structural integrity.
 * Adobe's engine does not: it rejects the document outright, reporting a
 * missing or invalid root object. That engine backs both Acrobat and Edge on
 * Windows, which is why an affected document can render everywhere except
 * those two.
 *
 * Emitting a classic cross-reference table instead keeps the output readable
 * by strict parsers. The trade-off is a larger file, since objects are no
 * longer packed into compressed object streams.
 *
 * Prefer this constant over an inline literal so the two writers cannot drift
 * apart again on a subset of the document pipeline.
 */
export const PDF_SAVE_OPTIONS: SaveOptions = {
  useObjectStreams: false,
};
