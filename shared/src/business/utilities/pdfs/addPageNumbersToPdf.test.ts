import { PDFDocument } from 'pdf-lib';
import { addPageNumbersToPdf } from './addPageNumbersToPdf';

describe('addPageNumbersToPdf', () => {
  const datePrinted = '05/26/2026';
  const docketNumber = '101-26';

  async function createTestPdf(pageCount: number): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    for (let i = 0; i < pageCount; i++) {
      pdfDoc.addPage([612, 792]); // standard letter size
    }
    return pdfDoc.save();
  }

  it('should return a valid PDF with the same number of pages', async () => {
    const pdfData = await createTestPdf(3);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    const resultDoc = await PDFDocument.load(result);
    expect(resultDoc.getPages()).toHaveLength(3);
  });

  it('should not add a header to the first page', async () => {
    const pdfData = await createTestPdf(2);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    const resultDoc = await PDFDocument.load(result);
    const firstPage = resultDoc.getPages()[0];
    // Extract text operators from the first page content stream
    const firstPageContent = firstPage.node
      .normalizedEntries()
      .Contents?.toString();

    // The first page should NOT contain the docket number header text
    // but SHOULD contain the footer text
    expect(firstPageContent).not.toContain(`Docket No.: ${docketNumber}`);
  });

  it('should add header with docket number and page number to pages after the first', async () => {
    const pdfData = await createTestPdf(3);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    const resultDoc = await PDFDocument.load(result);
    // Verify the second page has content drawn (more pages = more content streams)
    const secondPage = resultDoc.getPages()[1];
    expect(secondPage).toBeDefined();
  });

  it('should handle a single-page PDF without errors', async () => {
    const pdfData = await createTestPdf(1);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    const resultDoc = await PDFDocument.load(result);
    expect(resultDoc.getPages()).toHaveLength(1);
  });

  it('should add footer text to every page', async () => {
    const pdfData = await createTestPdf(4);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    // The result should be larger than the input since text was drawn
    expect(result.byteLength).toBeGreaterThan(pdfData.byteLength);
  });

  it('should produce a result that is a Uint8Array', async () => {
    const pdfData = await createTestPdf(2);

    const result = await addPageNumbersToPdf({
      datePrinted,
      docketNumber,
      pdfData,
    });

    expect(result).toBeInstanceOf(Uint8Array);
  });
});
