jest.mock('pdf-lib');
jest.mock('../generateSignedDocumentInteractor');

const fs = require('fs');
const path = require('path');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { addServedStampToDocument } = require('./addServedStampToDocument.js');
const { getPageDimensions } = require('../generateSignedDocumentInteractor');
const { PDFDocument } = require('pdf-lib');
const testAssetsPath = path.join(__dirname, '../../../../test-assets/');

const testPdfDocBytes = () => {
  // sample.pdf is a 1 page document
  return new Uint8Array(fs.readFileSync(testAssetsPath + 'sample.pdf'));
};

describe('addServedStampToDocument', () => {
  let testPdfDoc;
  let drawTextMock;
  let saveMock;

  beforeAll(() => {
    getPageDimensions.mockReturnValue([0, 0]);
  });

  beforeEach(() => {
    drawTextMock = jest.fn();
    saveMock = jest.fn();

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
          },
        ]),
        save: saveMock,
      }),
    );

    testPdfDoc = testPdfDocBytes();
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
  });
});
