const {
  loadPDFForPreviewInteractor,
} = require('./loadPDFForPreviewInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('loadPDFForPreviewInteractor', () => {
  it('fetches document from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue('pdf data');

    const result = await loadPDFForPreviewInteractor({
      applicationContext,
    });

    expect(result).toEqual('pdf data');
  });

  it('should throw an error if getDocument returns an error', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValue(
        new Error('some internal exception message that will not be seen'),
      );

    let error;
    try {
      await loadPDFForPreviewInteractor({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }

    expect(error).toEqual(new Error('error loading PDF'));
  });
});
