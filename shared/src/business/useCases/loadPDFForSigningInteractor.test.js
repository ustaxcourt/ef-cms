const pdfjsLib = require('pdfjs-dist');
const sinon = require('sinon');
const {
  loadPDFForSigningInteractor,
} = require('./loadPDFForSigningInteractor');
const { PDFDocument } = require('pdf-lib');

const removePageMock = jest.fn();
const saveMock = jest.fn();

describe('loadPDFForSigningInteractor', () => {
  beforeEach(() => {
    window.Response = sinon.stub().returns(() => {});
    window.Response.prototype.arrayBuffer = sinon
      .stub()
      .returns('array buffer data');
    pdfjsLib.getDocument = sinon.stub().returns({
      promise: 'pdf data',
    });
    PDFDocument.load = sinon.stub().returns({
      removePage: removePageMock,
      save: saveMock,
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('loadPDFForSigning', async () => {
    const result = await loadPDFForSigningInteractor({
      applicationContext: {
        getPdfJs: () => pdfjsLib,
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
        getPdfJs: () => pdfjsLib,
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
          getPdfJs: () => pdfjsLib,
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
