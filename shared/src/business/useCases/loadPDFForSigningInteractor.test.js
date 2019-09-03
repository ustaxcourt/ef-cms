const pdfjsLib = require('pdfjs-dist');
const sinon = require('sinon');
const {
  loadPDFForSigningInteractor,
} = require('./loadPDFForSigningInteractor');

describe('loadPDFForSigningInteractor', () => {
  beforeEach(() => {
    window.Response = sinon.stub().returns(() => {});
    window.Response.prototype.arrayBuffer = sinon
      .stub()
      .returns('array buffer data');
    pdfjsLib.getDocument = sinon.stub().returns({
      promise: 'pdf data',
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('loadPDFForSigning', async () => {
    const result = await loadPDFForSigningInteractor({
      applicationContext: {
        getPersistenceGateway: () => ({
          getDocument: () => null,
        }),
      },
    });

    expect(result).toEqual('pdf data');
  });

  it('should throw an error if getDocument returns an error', async () => {
    let error;
    try {
      await loadPDFForSigningInteractor({
        applicationContext: {
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
