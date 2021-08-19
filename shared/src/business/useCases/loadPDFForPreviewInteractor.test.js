const {
  loadPDFForPreviewInteractor,
} = require('./loadPDFForPreviewInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('loadPDFForPreviewInteractor', () => {
  it('should fetch the specified document from persistence', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockReturnValue('pdf data');

    const result = await loadPDFForPreviewInteractor(applicationContext, {
      docketEntryId: 'dba6fdd5-ae30-4018-9df1-7d04f123dee3',
      docketNumber: '123-45',
    });

    expect(result).toEqual('pdf data');
  });

  it('should throw an error when getDocument returns an error', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocument.mockRejectedValue(
        new Error('some internal exception message that will not be seen'),
      );

    await expect(
      loadPDFForPreviewInteractor(applicationContext, {}),
    ).rejects.toThrow('error loading PDF for preview');
  });
});
