const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  computeCoordinates,
  generateSignedDocumentInteractor,
  TEXT_SIZE,
} = require('./generateSignedDocumentInteractor');

describe('generateSignedDocument', () => {
  let drawRectangleMock;

  let drawTextMock;
  let rotationReturnValue;
  let saveMock;

  const mockSignatureName = '(Signed) Dr. Guy Fieri';
  const mockTitle = 'Chief Judge';

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
    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(
      applicationContext.getUtilities().setupPdfDocument.mock.calls[0][0],
    ).toMatchObject({
      pdfData: testPdfDoc,
    });
  });

  it('should draw the signature and title text on the pdf document', async () => {
    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(drawTextMock.mock.calls[0][0]).toEqual(mockSignatureName);
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      font: expect.anything(),
      rotate: expect.anything(),
      size: expect.anything(),
      x: expect.anything(),
      y: expect.anything(),
    });
    expect(drawTextMock.mock.calls[1][0]).toEqual(mockTitle);
    expect(drawTextMock.mock.calls[1][1]).toMatchObject({
      font: expect.anything(),
      rotate: expect.anything(),
      size: expect.anything(),
      x: expect.anything(),
      y: expect.anything(),
    });
  });

  it('should draw the rectangular stamp on the pdf document', async () => {
    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
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

  it('should set the stamp rotation to 0 degrees when the page rotation angle is undefined', async () => {
    rotationReturnValue = { angle: undefined };

    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(drawRectangleMock.mock.calls[0][0]).toMatchObject({
      rotate: { angle: 0 },
    });
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      rotate: {
        angle: 0,
      },
    });
    expect(drawTextMock.mock.calls[1][1]).toMatchObject({
      rotate: {
        angle: 0,
      },
    });
  });

  it('should set the stamp rotation equal to the page rotation when the PDF has been rotated', async () => {
    const mockRotationAngle = 80;
    rotationReturnValue = { angle: mockRotationAngle };

    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(drawRectangleMock.mock.calls[0][0]).toMatchObject({
      rotate: { angle: mockRotationAngle },
    });
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      rotate: {
        angle: mockRotationAngle,
      },
    });
    expect(drawTextMock.mock.calls[1][1]).toMatchObject({
      rotate: {
        angle: mockRotationAngle,
      },
    });
  });

  it('should use a default scale value of 1 when one has not been provided', async () => {
    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      scale: undefined,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({
      size: TEXT_SIZE, // textSize is calculated using scale
    });
  });

  it('should save the pdf', async () => {
    await generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: 0,
      pdfData: testPdfDoc,
      posX: 200,
      posY: 200,
      scale: undefined,
      sigTextData: {
        signatureName: mockSignatureName,
        signatureTitle: mockTitle,
      },
    });

    expect(saveMock.mock.calls[0][0]).toMatchObject({
      useObjectStreams: false,
    });
  });
});

describe('computeCoordinates', () => {
  const baseArguments = {
    applicationContext,
    boxHeight: 1,
    boxWidth: 2,
    lineHeight: 1,
    nameTextWidth: 2,
    pageRotation: 0,
    posX: 10,
    posY: 12,
    scale: 1,
    textHeight: 4,
    titleTextWidth: 4,
  };

  it('should calculate the x, y coordinates on the page of the bottom left hand corner of the signature box when the page is rotated 90', () => {
    const mockCropBox = {
      pageHeight: 10,
      pageWidth: 20,
      x: 5,
      y: 10,
    };

    computeCoordinates({
      ...baseArguments,
      cropBox: mockCropBox,
      pageRotation: 90,
    });

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: {
        x: baseArguments.posX / baseArguments.scale,
        y:
          mockCropBox.pageWidth -
          (baseArguments.posY + baseArguments.boxHeight) / baseArguments.scale,
      },
    });
  });

  it('should calculate the x, y coordinates on the page of the bottom left hand corner of the signature box when the page is rotated 270', () => {
    const mockCropBox = {
      pageHeight: 10,
      pageWidth: 20,
      x: 5,
      y: 10,
    };

    computeCoordinates({
      ...baseArguments,
      cropBox: mockCropBox,
      pageRotation: 270,
    });

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: {
        x: baseArguments.posX / baseArguments.scale,
        y:
          mockCropBox.pageWidth -
          (baseArguments.posY + baseArguments.boxHeight) / baseArguments.scale,
      },
    });
  });

  it('should calculate the x, y coordinates on the page of the bottom left hand corner of the signature box when the page is NOT rotated 90 or 270 degrees', () => {
    const mockCropBox = {
      pageHeight: 10,
      pageWidth: 20,
      x: 5,
      y: 10,
    };

    computeCoordinates({
      ...baseArguments,
      cropBox: mockCropBox,
      pageRotation: 30,
    });

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: {
        x: baseArguments.posX / baseArguments.scale,
        y:
          mockCropBox.pageHeight -
          (baseArguments.posY + baseArguments.boxHeight) / baseArguments.scale,
      },
    });
  });

  it('should call getStampBoxCoordinates to generate the x, y coordinates of where to place the signature box on the page', () => {
    const mockCropBox = {
      pageHeight: 10,
      pageWidth: 20,
      x: 5,
      y: 10,
    };
    const mockStampBoxCoordinates = { x: 50, y: 10 };
    applicationContext
      .getUtilities()
      .getStampBoxCoordinates.mockReturnValue(mockStampBoxCoordinates);

    const result = computeCoordinates({
      ...baseArguments,
      cropBox: mockCropBox,
    });

    expect(
      applicationContext.getUtilities().getStampBoxCoordinates.mock.calls[0][0],
    ).toMatchObject({
      bottomLeftBoxCoordinates: expect.anything(),
      cropBox: { x: expect.anything(), y: expect.anything() },
      pageHeight: expect.anything(),
      pageRotation: expect.anything(),
      pageWidth: expect.anything(),
    });
    expect(result).toMatchObject({
      rectangleX: mockStampBoxCoordinates.x,
      rectangleY: mockStampBoxCoordinates.y,
    });
  });

  describe('when cropbox coordinates are { x: 0, y: 0 }', () => {
    let args;

    const mockCropBox = { pageHeight: 150, pageWidth: 100, x: 0, y: 0 };

    beforeEach(() => {
      args = {
        ...baseArguments,
        cropBox: mockCropBox,
      };
    });

    it('should compute signature coordinates when the page rotation is 0 degrees', () => {
      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 10,
        sigNameY: 137.5,
        sigTitleX: 9,
        sigTitleY: 133,
      });
    });

    it('should compute signature coordinates when the page rotation is 90 degrees', () => {
      args.pageRotation = 90;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 20,
        sigNameY: 14,
        sigTitleX: 24,
        sigTitleY: 26,
      });
    });

    it('should compute signature coordinates when the page rotation is 180 degrees', () => {
      args.pageRotation = 180;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 90,
        sigNameY: 12.5,
        sigTitleX: 91,
        sigTitleY: 17,
      });
    });

    it('should compute signature coordinates when the page rotation is 270 degrees', () => {
      args.pageRotation = 270;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 80,
        sigNameY: 136,
        sigTitleX: 76,
        sigTitleY: 124,
      });
    });
  });

  describe('when cropbox coordinates are non-zero { x: 605, y: 0.5 }', () => {
    let args;

    const mockCropBox = { pageHeight: 150, pageWidth: 100, x: 0, y: 0 };

    beforeEach(() => {
      args = {
        ...baseArguments,
        cropBox: mockCropBox,
      };
    });

    it('should compute signature coordinates when the page rotation is 0 degrees', () => {
      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 10 + mockCropBox.x,
        sigNameY: 137.5 + mockCropBox.y,
        sigTitleX: 9 + mockCropBox.x,
        sigTitleY: 133 + mockCropBox.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 90 degrees', () => {
      args.pageRotation = 90;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 20 + mockCropBox.x,
        sigNameY: 14 + mockCropBox.y,
        sigTitleX: 24 + mockCropBox.x,
        sigTitleY: 26 + mockCropBox.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 180 degrees', () => {
      args.pageRotation = 180;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 90 + mockCropBox.x,
        sigNameY: 12.5 + mockCropBox.y,
        sigTitleX: 91 + mockCropBox.x,
        sigTitleY: 17 + mockCropBox.y,
      });
    });

    it('should compute signature coordinates when the page rotation is 270 degrees', () => {
      args.pageRotation = 270;

      const result = computeCoordinates(args);

      expect(result).toMatchObject({
        sigNameX: 80 + mockCropBox.x,
        sigNameY: 136 + mockCropBox.y,
        sigTitleX: 76 + mockCropBox.x,
        sigTitleY: 124 + mockCropBox.y,
      });
    });
  });
});
