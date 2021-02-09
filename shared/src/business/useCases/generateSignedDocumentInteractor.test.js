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
  let args = {
    boxHeight: 1,
    boxWidth: 2,
    lineHeight: 1,
    nameTextWidth: 2,
    pageHeight: 150,
    pageRotation: 0,
    pageWidth: 100,
    posX: 10,
    posY: 12,
    scale: 1,
    textHeight: 4,
    titleTextWidth: 4,
  };

  it('computes signature coordinates when the page rotation is 0 degrees', () => {
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

  it('computes signature coordinates when the page rotation is 90 degrees', () => {
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

  it('computes signature coordinates when the page rotation is 180 degrees', () => {
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

  it('computes signature coordinates when the page rotation is 270 degrees', () => {
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
