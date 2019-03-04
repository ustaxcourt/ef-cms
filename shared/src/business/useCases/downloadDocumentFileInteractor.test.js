const { downloadDocumentFile } = require('./downloadDocumentFileInteractor');

describe('downloadDocumentFile', () => {
  let applicationContext;
  it('returns the blob returned from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getPersistenceGateway: () => {
        return {
          getDocument: async () => 'abc',
        };
      },
    };
    const result = await downloadDocumentFile({
      applicationContext,
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toEqual('abc');
  });
});
