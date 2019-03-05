const { getDocument } = require('./getDocument');

describe('getDocument', () => {
  it('returns the expected file Blob which is returned from persistence', async () => {
    const BLOB_DATA = 'abc';
    let applicationContext = {
      getBaseUrl: () => 'http://localhost',
      getCurrentUser: () => {
        return { role: 'petitioner', userId: 'taxpayer' };
      },
      getCurrentUserToken: () => {
        return '';
      },
      getHttpClient: () => {
        const fun = () => ({
          data: BLOB_DATA,
        });
        fun.get = () => ({
          data: 'http://localhost',
        });
        return fun;
      },
      getPersistenceGateway: () => ({
        uploadPdf: () => BLOB_DATA,
      }),
    };
    const result = await getDocument({
      applicationContext,
    });
    expect(result).toEqual(new Blob([BLOB_DATA], { type: 'application/pdf' }));
  });
});
