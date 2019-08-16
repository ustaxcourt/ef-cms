const fs = require('fs');
const path = require('path');
const { generatePDFFromJPGs } = require('./generatePDFFromJPGs');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../test-assets/');
const testOutputPath = path.join(__dirname, '../../test-output/');

const testImgDocBytes = () => {
  return fs.readFileSync(testAssetsPath + 'sample.jpg');
};

describe('generatePDFFromJPGs', () => {
  let testImg;
  beforeEach(() => {
    testImg = testImgDocBytes();
  });

  it('creates a pdf document from the specified img data', async () => {
    const newPdfData = await generatePDFFromJPGs([testImg, testImg]);

    fs.writeFileSync(testOutputPath + 'generatePDFFromJPGData.pdf', newPdfData);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
