const { uploadDocument } = require('./uploadDocument');

describe('uploadDocument', () => {
  it('returns the expected documentId after when the upload was successful', async () => {
    const DOCUMENT_ID = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getHttpClient: () => ({
        get: () => ({
          data: 'url',
        }),
      }),
      getPersistenceGateway: () => ({
        uploadPdf: () => DOCUMENT_ID,
      }),
      getCurrentUser: () => {
        return { userId: 'taxpayer', role: 'petitioner' };
      },
      getCurrentUserToken: () => {
        return '';
      },
    };
    const documentId = await uploadDocument({
      applicationContext,
    });
    expect(documentId).toEqual(DOCUMENT_ID);
  });
});
