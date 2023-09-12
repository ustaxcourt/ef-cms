import { PDFDocument, PDFFont } from 'pdf-lib';
import { applicationContext } from '../test/createTestApplicationContext';
import { setupPdfDocument } from './setupPdfDocument';
import { testPdfDoc } from '../test/getFakeFile';

describe('setupPdfDocument', () => {
  const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
  applicationContext.getPdfLib.mockReturnValue({
    PDFDocument: {
      load: pdfDocumentLoadMock,
    },
    StandardFonts: {
      TimesRomanBold: 'Times-Bold',
    },
  });

  it('should return the loaded PDF document and the textFont', async () => {
    const result = await setupPdfDocument({
      applicationContext,
      pdfData: testPdfDoc,
    });

    expect(result.pdfDoc instanceof PDFDocument).toBe(true);
    expect(result.textFont instanceof PDFFont).toBe(true);
  });
});
