const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  generateSignedDocumentInteractor,
  translateXAndY,
} = require('./generateSignedDocumentInteractor');
const { PDFDocument } = require('pdf-lib');

describe('generateSignedDocument', () => {
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  it('generates a pdf document with the provided signature text attached', async () => {
    const args = {
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      scale: 1,
      sigTextData: {
        signatureName: '(Signed) Dr. Guy Fieri',
        signatureTitle: 'Chief Judge',
      },
    };

    const newPdfData = await generateSignedDocumentInteractor(args);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });

  it('uses a default scale value of 1 if not provided in args', async () => {
    const args = {
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: '(Signed) Dr. Guy Fieri',
        signatureTitle: 'Chief Judge',
      },
    };

    const newPdfData = await generateSignedDocumentInteractor(args);

    const newPdfDoc = await PDFDocument.load(newPdfData);
    const newPdfDocPages = newPdfDoc.getPages();
    expect(newPdfDocPages.length).toEqual(1);
  });

  describe('translateXAndY', () => {
    it('should not modify x and y if rotation is 0 degrees', () => {
      const { x, y } = translateXAndY({ rotation: 0, x: 100, y: 200 });

      expect(x).toEqual(100);
      expect(y).toEqual(200);
    });

    it('90 degrees', () => {
      const { x, y } = translateXAndY({ rotation: 90, x: 100, y: 200 });

      expect(y).toEqual(100);
      expect(x).toEqual(200);
    });

    it('180 degrees', () => {});

    it('270 degrees', () => {});
  });
});
