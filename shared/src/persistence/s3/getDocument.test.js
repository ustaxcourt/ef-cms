const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getDocument } = require('./getDocument');

const BLOB_DATA = 'abc';

describe('getDocument', () => {
  it('returns the expected file Blob which is returned from persistence', async () => {
    applicationContext.getHttpClient.mockImplementation(() => {
      const fun = () => ({
        data: BLOB_DATA,
      });
      fun.get = () => ({
        data: 'http://localhost',
      });
      return fun;
    });

    const result = await getDocument({
      applicationContext,
    });

    expect(result).toEqual(new Blob([BLOB_DATA], { type: 'application/pdf' }));
  });

  it('calls S3.getObject when S3 protocol is set', async () => {
    await getDocument({
      applicationContext,
      protocol: 'S3',
    });

    expect(applicationContext.getStorageClient().getObject).toHaveBeenCalled();
  });
});
