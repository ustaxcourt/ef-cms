const {
  addServedStampToDocument,
  computeCoordinates,
} = require('./addServedStampToDocument.js');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { degrees, PDFDocument } = require('pdf-lib');

describe('addServedStampToDocument', () => {
  let drawTextMock;
  let saveMock;
  let getTrimBoxMock;
  let getCropBoxMock;
  let trimBoxReturnValue;
  let cropBoxReturnValue;

  beforeAll(async () => {
    const pdfDoc = await PDFDocument.load(testPdfDoc);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    page.setRotation(degrees(90));
  });

  const pdfDocumentLoadMock = jest.fn(); //async () => await PDFDocument.load(testPdfDoc);

  beforeEach(() => {
    trimBoxReturnValue = { height: 200, width: 0, y: 0 };
    cropBoxReturnValue = { height: 200, width: 0, y: 0 };

    drawTextMock = jest.fn();
    saveMock = jest.fn();
    getTrimBoxMock = jest.fn().mockImplementation(() => trimBoxReturnValue);
    getCropBoxMock = jest.fn().mockImplementation(() => cropBoxReturnValue);

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

    pdfDocumentLoadMock.mockReturnValue(
      Promise.resolve({
        embedStandardFont: jest.fn().mockReturnValue({
          sizeAtHeight: jest.fn().mockReturnValue(50),
          widthOfTextAtSize: jest.fn().mockReturnValue(100),
        }),
        getPages: jest.fn().mockReturnValue([
          {
            drawRectangle: jest.fn(),
            drawText: drawTextMock,
            getCropBox: getCropBoxMock,
            getRotation() {
              return { angle: 270 };
            },
            getTrimBox: getTrimBoxMock,
          },
        ]),
        save: saveMock,
      }),
    );
  });

  it('adds a served stamp to a pdf document', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual('Test');
    expect(saveMock).toHaveBeenCalled();
  });

  it('adds a default SERVED label and date if serviceStampText is not given', async () => {
    applicationContext.getUtilities().formatNow.mockReturnValue('01/01/20');

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual('SERVED 01/01/20');
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 159 });
  });

  it('increases the y value of the rectangle and stamp when the image in the pdf exceeds the pages size', async () => {
    trimBoxReturnValue = { height: 200, width: 0, y: 20 };

    applicationContext.getUtilities().formatNow.mockReturnValue('01/01/20');

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
    });

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 159 });
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

  it('computes served stamp coordinates when the page rotation is 0 degrees', () => {
    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 49,
      rectangleY: 13,
    });
  });

  it('computes served stamp coordinates when the page rotation is 90 degrees', () => {
    args.pageRotation = 90;
    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 87,
      rectangleY: 74,
    });
  });

  it('computes served stamp coordinates when the page rotation is 180 degrees', () => {
    args.pageRotation = 180;
    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 51,
      rectangleY: 137,
    });
  });

  it('computes served stamp coordinates when the page rotation is 270 degrees', () => {
    args.pageRotation = 270;
    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 12.999999999999986,
      rectangleY: 76,
    });
  });
});
