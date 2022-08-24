const {
  applicationContext,
  testPdfDoc,
} = require('../test/createTestApplicationContext');
const {
  loadPDFForSigningInteractor,
} = require('./loadPDFForSigningInteractor');
const { PDFDocument } = require('pdf-lib');

const removePageMock = jest.fn();
const saveMock = jest.fn();
const fakePdfPages = ['page1', 'page2'];
const getPagesMock = jest.fn().mockReturnValue(fakePdfPages);

describe('loadPDFForSigningInteractor', () => {
  beforeEach(() => {
    applicationContext.getPdfJs().getDocument.mockReturnValue({
      promise: 'pdf data',
    });
    window.Response = jest.fn().mockReturnValue({
      arrayBuffer: () => Promise.resolve('array buffer data'),
    });
    PDFDocument.load = jest.fn().mockReturnValue({
      getPages: getPagesMock,
      removePage: removePageMock,
      save: saveMock,
    });
  });

  it('loadPDFForSigning', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(null);

    const result = await loadPDFForSigningInteractor(applicationContext, {});

    expect(result).toEqual('pdf data');
  });

  it('should remove the first page of the PDF if `removeCover` is set to true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(null);

    await loadPDFForSigningInteractor(applicationContext, {
      removeCover: true,
    });

    expect(removePageMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
  });

  it('should remove all pages of the PDF except the coversheet if `onlyCover` is set to true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue(testPdfDoc);

    await loadPDFForSigningInteractor(applicationContext, {
      onlyCover: true,
    });

    expect(removePageMock).toHaveBeenCalledTimes(fakePdfPages.length - 1);
    expect(saveMock).toHaveBeenCalled();
  });

  it('should throw an error if getDocument returns an error', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockImplementation(() => {
        throw new Error('something');
      });

    await expect(
      loadPDFForSigningInteractor(applicationContext, {}),
    ).rejects.toThrow(new Error('error loading PDF for signing'));
  });
});
