const { uploadDocumentFromClient } = require('./uploadDocumentFromClient');
const { User } = require('../../business/entities/User');

describe('uploadDocument', () => {
  it('returns the expected documentId after the upload was successful', async () => {
    const DOCUMENT_ID = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getCurrentUser: () => {
        return { role: User.ROLES.petitioner, userId: 'petitioner' };
      },
      getCurrentUserToken: () => {
        return '';
      },
      getHttpClient: () => ({
        get: () => ({
          data: 'url',
        }),
      }),
      getPersistenceGateway: () => ({
        uploadPdfFromClient: () => DOCUMENT_ID,
      }),
      getUniqueId: () => DOCUMENT_ID,
    };
    const documentId = await uploadDocumentFromClient({
      applicationContext,
    });
    expect(documentId).toEqual(DOCUMENT_ID);
  });
});
