const fs = require('fs');
const path = require('path');
const { addServedStampToDocument } = require('./addServedStampToDocument.js');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

describe('addServedStampToDocument', () => {
  let testPdfDoc;

  beforeEach(() => {
    testPdfDoc = testPdfDocBytes();
  });

  it('adds a served stamp to a pdf document without changing the number of pages', async () => {
    const newPdfData = await addServedStampToDocument({
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });
});
