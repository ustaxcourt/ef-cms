const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { uploadDocumentFromClient } = require('./uploadDocumentFromClient');

describe('uploadDocument', () => {
  it('returns the expected key after the upload was successful', async () => {
    const KEY = 'abc';
    applicationContext.getUniqueId.mockReturnValue(KEY);
    applicationContext
      .getPersistenceGateway()
      .uploadPdfFromClient.mockReturnValue(KEY);

    const key = await uploadDocumentFromClient({
      applicationContext,
    });

    expect(key).toEqual(KEY);
  });
});
