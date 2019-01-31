const { downloadDocumentFile } = require('./downloadDocumentFile.interactor');

describe('downloadDocumentFile', () => {
  let applicationContext;
  it('returns the blob returned from persistence', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getDocument: async () => 'abc',
        };
      },
      environment: { stage: 'local' },
    };
    const result = await downloadDocumentFile({
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
    });
    expect(result).toEqual('abc');
  });
});
