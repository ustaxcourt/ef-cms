import { PDFDocument, PDFFont } from 'pdf-lib';
import {
  applicationContextForClient as applicationContext,
  testPdfDoc,
} from '../test/createTestApplicationContext';
import { setupPdfDocument } from './setupPdfDocument';

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
