const fs = require('fs');
const path = require('path');
const {
  generateSignedDocumentInteractor,
} = require('./generateSignedDocumentInteractor.js');
const { PDFDocumentFactory } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

function testPdfDocBytes() {
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
}

function testSignatureImgBytes() {
  return fs.readFileSync(testAssetsPath + 'signature.png');
}

describe('generateSignedDocument', () => {
  let testDoc;
  let testSig;
  beforeEach(() => {
    testDoc = testPdfDocBytes();
    testSig = testSignatureImgBytes();
  });

  it('generates a pdf document with the provided signature attached', async () => {
    const args = {
      pageIndex: 0,
      pdfData: testDoc,
      posX: 100,
      posY: 100,
      scale: 1,
      sigImgData: testSig,
    };

    const newPdfData = await generateSignedDocumentInteractor(args);

    fs.writeFileSync(
      testOutputPath + 'generateSignedDocument_Image.pdf',
      newPdfData,
    );

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });

  it('generates a pdf document with the provided signature text attached', async () => {
    const args = {
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

    const newPdfDoc = PDFDocumentFactory.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });
});
