const fs = require('fs');
const path = require('path');
const {
  generateSignedDocumentInteractor,
} = require('./generateSignedDocumentInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { PDFDocument } = require('pdf-lib');

describe('generateSignedDocument', () => {
  const testAssetsPath = path.join(__dirname, '../../../test-assets/');
  const testOutputPath = path.join(__dirname, '../../../test-output/');

  const testPdfDocBytes = () => {
    return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
  };

  let testDoc;

  beforeEach(() => {
    jest.setTimeout(10000);
    testDoc = testPdfDocBytes();
  });

  it('generates a pdf document with the provided signature text attached', async () => {
    const args = {
      applicationContext,
      pageIndex: 0,
      pdfData: testDoc,
      posX: 200,
      posY: 200,
      scale: 1,
      sigTextData: {
        signatureName: '(Signed) Dr. Guy Fieri',
        signatureTitle: 'Chief Judge',
      },
    };

    const newPdfData = await generateSignedDocumentInteractor(args);

    fs.writeFileSync(
      testOutputPath + 'generateSignedDocument_Text.pdf',
      newPdfData,
    );

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });

  it('uses a default scale value of 1 if not provided in args', async () => {
    const args = {
      applicationContext,
      pageIndex: 0,
      pdfData: testDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: '(Signed) Dr. Guy Fieri',
        signatureTitle: 'Chief Judge',
      },
    };

    const newPdfData = await generateSignedDocumentInteractor(args);

    fs.writeFileSync(
      testOutputPath + 'generateSignedDocument_Text.pdf',
      newPdfData,
    );

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });
});
