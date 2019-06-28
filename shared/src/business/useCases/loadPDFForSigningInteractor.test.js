const pdfjsLib = require('pdfjs-dist');
const sinon = require('sinon');
const { loadPDFForSigning } = require('./loadPDFForSigningInteractor');

describe('loadPDFForSigning', () => {
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
    const result = await loadPDFForSigning({
      applicationContext: {
        getPersistenceGateway: () => ({
          getDocument: () => null,
        }),
      },
    });

    expect(result).toEqual('pdf data');
  });
});
