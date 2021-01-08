jest.mock('pdf-lib');
jest.mock('../generateSignedDocumentInteractor');
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { addServedStampToDocument } = require('./addServedStampToDocument.js');
const { getPageDimensions } = require('../generateSignedDocumentInteractor');
const { PDFDocument } = require('pdf-lib');

describe('addServedStampToDocument', () => {
  let drawTextMock;
  let saveMock;
  let getTrimBoxMock;
  let trimBoxReturnValue;

  beforeAll(() => {
    getPageDimensions.mockReturnValue([0, 0]);
  });

  beforeEach(() => {
    trimBoxReturnValue = { width: 0, y: 0 };

    drawTextMock = jest.fn();
    saveMock = jest.fn();
    getTrimBoxMock = jest.fn().mockImplementation(() => trimBoxReturnValue);

    PDFDocument.load.mockReturnValue(
      Promise.resolve({
        embedStandardFont: jest.fn().mockReturnValue({
          sizeAtHeight: jest.fn(),
          widthOfTextAtSize: jest.fn(),
        }),
        getPages: jest.fn().mockReturnValue([
          {
            drawRectangle: jest.fn(),
            drawText: drawTextMock,
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
    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 12 });
  });

  it('increases the y value of the rectangle and stamp when the image in the pdf exceeds the pages size', async () => {
    trimBoxReturnValue = { width: 0, y: 20 };

    applicationContext.getUtilities().formatNow.mockReturnValue('01/01/20');

    await addServedStampToDocument({
      applicationContext,
      pdfData: testPdfDoc,
    });

    expect(drawTextMock.mock.calls[0][1]).toMatchObject({ y: 32 });
  });
});
