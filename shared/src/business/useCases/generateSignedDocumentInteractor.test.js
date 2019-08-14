const fs = require('fs');
const path = require('path');
const {
  generateSignedDocumentInteractor,
  getPageDimensions,
} = require('./generateSignedDocumentInteractor.js');
const { PDFDocument } = require('pdf-lib');

const testAssetsPath = path.join(__dirname, '../../../test-assets/');
const testOutputPath = path.join(__dirname, '../../../test-output/');

const testPdfDocBytes = () => {
  return fs.readFileSync(testAssetsPath + 'sample.pdf');
};

describe('getPageDimensions', () => {
  it('should throw an error if the pdf does not have a media box element', async () => {
    let error;
    try {
      getPageDimensions({
        Parent: {
          ascend: cb => {
            cb({
              getMaybe: () => false,
            });
          },
        },
        get: () => true,
        getMaybe: () => true,
        index: {
          lookup: () => null,
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('Page Tree is missing MediaBox');
  });
});

describe('generateSignedDocument', () => {
  let testDoc;

  beforeEach(() => {
    testDoc = testPdfDocBytes();
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

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });
});
