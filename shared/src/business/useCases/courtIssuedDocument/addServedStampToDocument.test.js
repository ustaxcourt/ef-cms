const {
  addServedStampToDocument,
  computeCoordinates,
  PADDING,
} = require('./addServedStampToDocument.js');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');

describe('addServedStampToDocument', () => {
  let rotationReturnValue;

  let drawTextMock;
  let drawRectangleMock;
  let saveMock;

  beforeEach(() => {
    rotationReturnValue = { angle: 270 };

    drawTextMock = jest.fn();
    drawRectangleMock = jest.fn();
    saveMock = jest.fn();

    applicationContext.getUtilities().setupPdfDocument.mockReturnValue({
      pdfDoc: {
        getPages: () => [
          {
            drawRectangle: drawRectangleMock,
            drawText: drawTextMock,
            getRotation: jest
              .fn()
              .mockImplementation(() => rotationReturnValue),
          },
        ],
        save: saveMock,
      },
      textFont: {
        sizeAtHeight: jest.fn(),
        widthOfTextAtSize: jest.fn(),
      },
    });

    applicationContext.getUtilities().getCropBox.mockReturnValue({});

    applicationContext.getUtilities().getStampBoxCoordinates.mockReturnValue({
      x: 0,
      y: 0,
    });
  });

  it('should make a call to load and setup the PDF', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(
      applicationContext.getUtilities().setupPdfDocument.mock.calls[0][0],
    ).toMatchObject({
      pdfData: testPdfDoc,
    });
  });

  it('should draw the served text on the pdf document', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual('Test');
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      font: expect.anything(),
      rotate: expect.anything(),
      size: expect.anything(),
      x: expect.anything(),
      y: expect.anything(),
    });
  });

  it('should draw the rectangular stamp on the pdf document', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawRectangleMock.mock.calls[0][0]).toMatchObject({
      color: expect.anything(),
      height: expect.anything(),
      rotate: expect.anything(),
      width: expect.anything(),
      x: expect.anything(),
      y: expect.anything(),
    });
  });

  it('should generate a served stamp when serviceStampText is not provided', async () => {
    const mockTodaysDate = '01/01/20';
    applicationContext.getUtilities().formatNow.mockReturnValue(mockTodaysDate);

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: undefined,
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual(`SERVED ${mockTodaysDate}`);
  });

  it('should set the stamp rotation to 0 degrees when the page rotation angle is undefined', async () => {
    rotationReturnValue = { angle: undefined };

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawRectangleMock.mock.calls[0][0]).toMatchObject({
      rotate: { angle: 0 },
    });
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      rotate: { angle: 0 },
    });
  });

  it('should set the stamp rotation equal to the page rotation when the PDF has been rotated', async () => {
    const mockRotationAngle = 50;
    rotationReturnValue = { angle: mockRotationAngle };

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(drawRectangleMock.mock.calls[0][0]).toMatchObject({
      rotate: { angle: mockRotationAngle },
    });
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      rotate: { angle: mockRotationAngle },
    });
  });

  it('should save the pdf', async () => {
    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
      serviceStampText: 'Test',
    });

    expect(saveMock.mock.calls[0][0]).toMatchObject({
      useObjectStreams: false,
    });
  });
});

describe('computeCoordinates', () => {
  const mockPageHeight = 150;
  const mockPageWidth = 100;
  const mockBoxHeight = 1;
  const mockBoxWidth = 2;
  const mockCropBoxY = 20;

  let args = {
    applicationContext,
    boxHeight: mockBoxHeight,
    boxWidth: mockBoxWidth,
    pageRotation: 0,
    pageToApplyStampTo: {},
  };

  beforeEach(() => {
    applicationContext.getUtilities().getCropBox.mockReturnValue({
      pageHeight: mockPageHeight,
      pageWidth: mockPageWidth,
      x: 10,
      y: mockCropBoxY,
    });
  });

  it('should make a call to get the cropBox values of the page to apply the stamp to', () => {
    computeCoordinates(args);

    expect(applicationContext.getUtilities().getCropBox).toHaveBeenCalled();
  });

  it('should calculate the x, y coordinates on the page of the bottom left hand corner of the stamp box', () => {
    computeCoordinates(args);

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: {
        x: mockPageWidth / 2 - mockBoxWidth / 2,
        y: mockCropBoxY + mockBoxHeight + PADDING * 2,
      },
    });
  });

  it('should make a call to calculate the x, y coordinates of the stamp on the page', () => {
    computeCoordinates(args);

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: {
        x: mockPageWidth / 2 - mockBoxWidth / 2,
        y: mockCropBoxY + mockBoxHeight + PADDING * 2,
      },
      cropBox: {
        x: expect.anything(),
        y: mockCropBoxY,
      },
      pageHeight: mockPageHeight,
      pageRotation: expect.anything(),
      pageWidth: mockPageWidth,
    });
  });
});
