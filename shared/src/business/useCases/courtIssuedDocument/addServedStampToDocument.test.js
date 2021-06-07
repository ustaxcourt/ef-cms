const {
  addServedStampToDocument,
  computeCoordinates,
} = require('./addServedStampToDocument.js');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');

describe('addServedStampToDocument', () => {
  let drawTextMock;
  let rotationReturnValue;
  let saveMock;

  beforeEach(() => {
    drawTextMock = jest.fn();
    rotationReturnValue = { angle: 270 };
    saveMock = jest.fn();

    applicationContext.getUtilities().getCropBoxCoordinates.mockReturnValue({
      pageHeight: 200,
      pageWidth: 0,
      y: 0,
    });

    applicationContext.getUtilities().setupPdfDocument.mockReturnValue({
      pageToApplyStampTo: {
        drawRectangle: jest.fn(),
        drawText: drawTextMock,
        getRotation: jest.fn().mockImplementation(() => rotationReturnValue),
      },
      pdfDoc: {
        getPages: () => [
          {
            drawRectangle: jest.fn(),
            drawText: drawTextMock,
            getRotation: jest
              .fn()
              .mockImplementation(() => rotationReturnValue),
          },
        ],
        save: saveMock,
      },
      textFont: {
        sizeAtHeight: jest.fn().mockReturnValue(50),
        widthOfTextAtSize: jest.fn().mockReturnValue(100),
      },
    });
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

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      rotate: { angle: 0 },
    });
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
