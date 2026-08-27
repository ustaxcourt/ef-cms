import { PDFDocument } from 'pdf-lib';
import { PDF_SAVE_OPTIONS } from './pdfSaveOptions';

const buildPdf = async (): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.addPage([200, 200]).drawText('DAWSON');
  return pdfDoc;
};

const asLatin1 = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('latin1');

describe('PDF_SAVE_OPTIONS', () => {
  it('disables object streams', () => {
    expect(PDF_SAVE_OPTIONS).toEqual({ useObjectStreams: false });
  });

  it('emits a classic cross-reference table and no object streams', async () => {
    const pdfDoc = await buildPdf();

    const saved = asLatin1(await pdfDoc.save(PDF_SAVE_OPTIONS));

    expect(saved).toMatch(/\nxref\r?\n/);
    expect(saved).not.toMatch(/\/Type\s*\/XRef/);
    expect(saved).not.toMatch(/\/Type\s*\/ObjStm/);
  });

  // Guards the premise of the constant: if a future pdf-lib upgrade changed
  // its default, PDF_SAVE_OPTIONS would be a no-op and this would fail.
  it("differs from pdf-lib's default, which emits a cross-reference stream", async () => {
    const pdfDoc = await buildPdf();

    const savedWithDefaults = asLatin1(await pdfDoc.save());

    expect(savedWithDefaults).toMatch(/\/Type\s*\/ObjStm/);
    expect(savedWithDefaults).not.toMatch(/\nxref\r?\n/);
  });
});
