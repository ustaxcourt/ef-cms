const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { combineTwoPdfs } = require('./combineTwoPdfs');
const { PDFDocument } = require('pdf-lib');

describe('combineTwoPdfs', () => {
  applicationContext
    .getDocumentGenerators()
    .addressLabelCoverSheet.mockResolvedValue(testPdfDoc);

  it('should combine two pdfs into single pdf', async () => {
    const newPdfData = await combineTwoPdfs({
      applicationContext,
      firstPdf: testPdfDoc,
      secondPdf: testPdfDoc,
    });

    const newPdf = await PDFDocument.load(newPdfData);

    expect(newPdf.getPages().length).toEqual(2);
  });
});
