const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  computeCoordinates,
  generateSignedDocumentInteractor,
} = require('./generateSignedDocumentInteractor');
const { degrees, PDFDocument } = require('pdf-lib');

describe('generateSignedDocument', () => {
  let rotatedTestPdfDoc;

  beforeAll(async () => {
    const pdfDoc = await PDFDocument.load(testPdfDoc);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    page.setRotation(degrees(90));

    rotatedTestPdfDoc = await pdfDoc.save({
      useObjectStreams: false,
    });
  });

  const pdfDocumentLoadMock = async () => await PDFDocument.load(testPdfDoc);
  const rotatedPdfDocumentLoadMock = async () =>
    await PDFDocument.load(rotatedTestPdfDoc);

  beforeEach(() => {
    jest.setTimeout(30000);

    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        load: pdfDocumentLoadMock,
      },
      StandardFonts: {
        HelveticaBold: 'Helvetica-Bold',
      },
      degrees: () => {},
      rgb: () => {},
    });
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

  it('generates a pdf document with the provided signature text attached with rotated PDF', async () => {
    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        load: rotatedPdfDocumentLoadMock,
      },
      StandardFonts: {
        HelveticaBold: 'Helvetica-Bold',
      },
      degrees: () => {},
      rgb: () => {},
    });

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
});

describe('computeCoordinates', () => {
  describe('when cropbox coordinates are { x: 0, y: 0 }', () => {
    let args;

    beforeEach(() => {
      args = {
        boxHeight: 1,
        boxWidth: 2,
        cropBoxCoordinates: { pageHeight: 150, pageWidth: 100, x: 0, y: 0 },
        lineHeight: 1,
        nameTextWidth: 2,
        pageRotation: 0,
        posX: 10,
        posY: 12,
        scale: 1,
        textHeight: 4,
        titleTextWidth: 4,
      };
    });

    it('should compute signature coordinates when the page rotation is 0 degrees', () => {
      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 10,
        rectangleY: 137,
        sigNameX: 10,
        sigNameY: 137.5,
        sigTitleX: 9,
        sigTitleY: 133,
      });
    });

    it('should compute signature coordinates when the page rotation is 90 degrees', () => {
      args.pageRotation = 90;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 13,
        rectangleY: 10.000000000000005,
        sigNameX: 20,
        sigNameY: 14,
        sigTitleX: 24,
        sigTitleY: 26,
      });
    });

    it('should compute signature coordinates when the page rotation is 180 degrees', () => {
      args.pageRotation = 180;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 89.99999999999999,
        rectangleY: 13,
        sigNameX: 90,
        sigNameY: 12.5,
        sigTitleX: 91,
        sigTitleY: 17,
      });
    });

    it('should compute signature coordinates when the page rotation is 270 degrees', () => {
      args.pageRotation = 270;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 87,
        rectangleY: 139.99999999999997,
        sigNameX: 80,
        sigNameY: 136,
        sigTitleX: 76,
        sigTitleY: 124,
      });
    });
  });

  describe('when cropbox coordinates are non-zero { x: 605, y: 0.5 }', () => {
    let args;

    const cropBoxCoordinates = {
      pageHeight: 150,
      pageWidth: 100,
      x: 605,
      y: 0.5,
    };

    beforeEach(() => {
      args = {
        boxHeight: 1,
        boxWidth: 2,
        cropBoxCoordinates,
        lineHeight: 1,
        nameTextWidth: 2,
        pageRotation: 0,
        posX: 10,
        posY: 12,
        scale: 1,
        textHeight: 4,
        titleTextWidth: 4,
      };
    });

    it('should compute signature coordinates when the page rotation is 0 degrees', () => {
      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 10 + cropBoxCoordinates.x,
        rectangleY: 137 + cropBoxCoordinates.y,
        sigNameX: 10 + cropBoxCoordinates.x,
        sigNameY: 137.5 + cropBoxCoordinates.y,
        sigTitleX: 9 + cropBoxCoordinates.x,
        sigTitleY: 133 + cropBoxCoordinates.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 90 degrees', () => {
      args.pageRotation = 90;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 13 + cropBoxCoordinates.x,
        rectangleY: 10.000000000000005 + cropBoxCoordinates.y,
        sigNameX: 20 + cropBoxCoordinates.x,
        sigNameY: 14 + cropBoxCoordinates.y,
        sigTitleX: 24 + cropBoxCoordinates.x,
        sigTitleY: 26 + cropBoxCoordinates.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 180 degrees', () => {
      args.pageRotation = 180;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 89.99999999999999 + cropBoxCoordinates.x,
        rectangleY: 13 + cropBoxCoordinates.y,
        sigNameX: 90 + cropBoxCoordinates.x,
        sigNameY: 12.5 + cropBoxCoordinates.y,
        sigTitleX: 91 + cropBoxCoordinates.x,
        sigTitleY: 17 + cropBoxCoordinates.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 270 degrees', () => {
      args.pageRotation = 270;

      const result = computeCoordinates(args);

      expect(result).toEqual({
        rectangleX: 87 + cropBoxCoordinates.x,
        rectangleY: 139.99999999999997 + cropBoxCoordinates.y,
        sigNameX: 80 + cropBoxCoordinates.x,
        sigNameY: 136 + cropBoxCoordinates.y,
        sigTitleX: 76 + cropBoxCoordinates.x,
        sigTitleY: 124 + cropBoxCoordinates.y,
      });
    });
  });
});
