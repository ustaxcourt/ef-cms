const { getPageDimensions } = require('./generateSignedDocumentInteractor.js');
const { PDFDocument } = require('pdf-lib');

describe('getPageDimensions', () => {
  it('returns the dimensions of a page', async () => {
    const width = 350;
    const height = 500;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([width, height]);
    pdfDoc.addPage(page);

    expect(getPageDimensions(page)).toEqual([width, height]);
  });
});
