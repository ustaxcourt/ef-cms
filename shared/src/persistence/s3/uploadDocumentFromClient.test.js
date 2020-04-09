const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { uploadDocumentFromClient } = require('./uploadDocumentFromClient');

describe('uploadDocument', () => {
  it('returns the expected documentId after the upload was successful', async () => {
    const DOCUMENT_ID = 'abc';
    applicationContext.getUniqueId.mockReturnValue(DOCUMENT_ID);
    applicationContext
      .getPersistenceGateway()
      .uploadPdfFromClient.mockReturnValue(DOCUMENT_ID);

    const documentId = await uploadDocumentFromClient({
      applicationContext,
    });

    expect(documentId).toEqual(DOCUMENT_ID);
  });
});
