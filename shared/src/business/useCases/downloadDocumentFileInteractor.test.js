const {
  downloadDocumentFileInteractor,
} = require('./downloadDocumentFileInteractor');

describe('downloadDocumentFileInteractor', () => {
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
    const result = await downloadDocumentFileInteractor({
      applicationContext,
      documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(result).toEqual('abc');
  });
});
