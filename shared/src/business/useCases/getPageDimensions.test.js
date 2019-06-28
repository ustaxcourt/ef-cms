const { getPageDimensions } = require('./generateSignedDocumentInteractor.js');
const { PDFDocumentFactory } = require('pdf-lib');

describe('getPageDimensions', () => {
  it('returns the dimensions of a page', () => {
    const width = 350;
    const height = 500;
    const pdfDoc = PDFDocumentFactory.create();
    const page = pdfDoc.createPage([width, height]);
    pdfDoc.addPage(page);

    expect(getPageDimensions(page)).toEqual([width, height]);
  });
});
