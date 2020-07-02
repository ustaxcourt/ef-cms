const fs = require('fs');
const path = require('path');
const {
  generatePDFFromJPGDataInteractor,
} = require('./generatePDFFromJPGDataInteractor.js');
const { applicationContext } = require('../test/createTestApplicationContext');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

const testJpgBytes = () => {
  return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.jpg'));
};

describe('generatePDFFromJPGDataInteractor', () => {
  let testJpg;

  beforeEach(() => {
    testJpg = testJpgBytes();
  });

  it('generates a pdf document from the provided imgData array', async () => {
    const imgData = [testJpg, testJpg];

    const newPdfData = await generatePDFFromJPGDataInteractor(
      imgData,
      applicationContext,
    );

    fs.writeFileSync(
      testOutputPath + 'generatePDFFromJPGDataInteractor.pdf',
      newPdfData,
    );

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(2);
  });
});
