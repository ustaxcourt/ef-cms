const pdfjsLib = require('pdfjs-dist');
const {
  loadPDFForSigningInteractor,
} = require('./loadPDFForSigningInteractor');
const { PDFDocument } = require('pdf-lib');

const removePageMock = jest.fn();
const saveMock = jest.fn();

describe('loadPDFForSigningInteractor', () => {
  beforeEach(() => {
    window.Response = jest.fn().mockReturnValue(() => {});
    window.Response.prototype.arrayBuffer = jest
      .fn()
      .mockReturnValue('array buffer data');
    pdfjsLib.getDocument = jest.fn().mockReturnValue({
      promise: 'pdf data',
    });
    PDFDocument.load = jest.fn().mockReturnValue({
      removePage: removePageMock,
      save: saveMock,
    });
  });

  it('loadPDFForSigning', async () => {
    const result = await loadPDFForSigningInteractor({
      applicationContext: {
        getPdfJs: async () => pdfjsLib,
        getPersistenceGateway: () => ({
          getDocument: () => null,
        }),
      },
    });

    expect(result).toEqual('pdf data');
  });

  it('should remove the first page of the PDF if `removeCover` is set to true', async () => {
    await loadPDFForSigningInteractor({
      applicationContext: {
        getPdfJs: async () => pdfjsLib,
        getPersistenceGateway: () => ({
          getDocument: () => null,
        }),
      },
      removeCover: true,
    });

    expect(removePageMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
  });

  it('should throw an error if getDocument returns an error', async () => {
    let error;
    try {
      await loadPDFForSigningInteractor({
        applicationContext: {
          getPdfJs: async () => pdfjsLib,
          getPersistenceGateway: () => ({
            getDocument: () => {
              throw new Error('something');
            },
          }),
        },
      });
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(new Error('error loading PDF'));
  });
});
