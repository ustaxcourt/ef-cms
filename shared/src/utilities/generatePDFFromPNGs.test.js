const fs = require('fs');
const path = require('path');
const { generatePDFFromPNGs } = require('./generatePDFFromPNGs');
const { PDFDocumentFactory } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../test-assets/');
const testOutputPath = path.join(__dirname, '../../test-output/');

const testImgDocBytes = () => {
  return fs.readFileSync(testAssetsPath + 'sample.png');
};

describe('generatePDFFromPNGs', () => {
  let testImg;
  beforeEach(() => {
    testImg = testImgDocBytes();
  });

  it('creates a pdf document from the specified img data', async () => {
    const newPdfData = await generatePDFFromPNGs([testImg, testImg]);

    fs.writeFileSync(testOutputPath + 'generatePDFFromPNGData.pdf', newPdfData);

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
