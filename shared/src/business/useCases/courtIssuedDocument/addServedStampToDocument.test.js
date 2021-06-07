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
  let degreesMock;
  let drawTextMock;
  let getRotationMock;
  let getTrimBoxMock;
  let pdfDocumentLoadMock;
  let rotationReturnValue;
  let saveMock;
  let trimBoxReturnValue;

  beforeAll(async () => {
    const pdfDoc = await PDFDocument.load(testPdfDoc);
    const pages = pdfDoc.getPages();
    const page = pages[0];

    page.setRotation(degrees(90));
  });

  beforeEach(() => {
    rotationReturnValue = { angle: 270 };
    trimBoxReturnValue = { height: 200, width: 0, y: 0 };

    degreesMock = jest.fn().mockImplementation(num => num);
    drawTextMock = jest.fn();
    getRotationMock = jest.fn().mockImplementation(() => rotationReturnValue);
    getTrimBoxMock = jest.fn().mockImplementation(() => trimBoxReturnValue);
    pdfDocumentLoadMock = jest.fn(); //async () => await PDFDocument.load(testPdfDoc);
    saveMock = jest.fn();

    applicationContext.getPdfLib.mockReturnValue({
      PDFDocument: {
        load: pdfDocumentLoadMock,
      },
      StandardFonts: {
        TimesRomanBold: 'Times-Bold',
      },
      degrees: degreesMock,
      rgb: () => {},
    });

    applicationContext.getUtilities().getCropBoxCoordinates.mockReturnValue({
      pageHeight: 200,
      pageWidth: 0,
      y: 0,
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
            getRotation: getRotationMock,
            getTrimBox: getTrimBoxMock,
          },
        ]),
        save: saveMock,
      }),
    );
  });

  it('should add a served stamp to the pdf document', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual('Test');
    expect(saveMock).toHaveBeenCalled();
  });

  it('should add a default SERVED label and date if serviceStampText is not given', async () => {
    applicationContext.getUtilities().formatNow.mockReturnValue('01/01/20');

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual('SERVED 01/01/20');
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 259 });
  });

  it('should increase the y value of the rectangle and stamp when the image in the pdf exceeds the page size', async () => {
    trimBoxReturnValue = { height: 200, width: 0, y: 20 };

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 259 });
  });

  it('should default the stamp rotation angle to 0 degrees when the page rotation angle is undefined', async () => {
    rotationReturnValue = { angle: undefined };

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ rotate: 0 });
  });
});

describe('computeCoordinates', () => {
  let args = {
    applicationContext,
    boxHeight: 1,
    boxWidth: 2,
    pageRotation: 0,
    pageToApplyStampTo: {},
  };

  beforeEach(() => {
    applicationContext.getUtilities().getCropBoxCoordinates.mockReturnValue({
      pageHeight: 150,
      pageWidth: 100,
      x: 10,
      y: 20,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 0 degrees', () => {
    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 59,
      rectangleY: 47,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 90 degrees', () => {
    args.pageRotation = 90;

    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 83,
      rectangleY: 69,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 180 degrees', () => {
    args.pageRotation = 180;

    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 61,
      rectangleY: 143,
    });
  });

  it('should accurately compute the bottom right hand corner coordinates to place the served stamp when the page rotation is 270 degrees', () => {
    args.pageRotation = 270;

    const result = computeCoordinates(args);

    expect(result).toEqual({
      rectangleX: 36.999999999999986,
      rectangleY: 121,
    });
  });
});
