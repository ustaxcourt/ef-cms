const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getDocument } = require('./getDocument');

describe('getDocument', () => {
  it('returns the expected file Blob which is returned from persistence', async () => {
    const BLOB_DATA = 'abc';
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
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: '',
      }),
    });

    await getDocument({
      applicationContext,
      protocol: 'S3',
    });

    expect(applicationContext.getStorageClient().getObject).toHaveBeenCalled();
  });

  it('retrieves from the temp bucket when S3 protocol is set and useTempBucket is true', async () => {
    const tempBucketName = 'tempBucket';
    applicationContext.getTempDocumentsBucketName.mockReturnValue(
      tempBucketName,
    );
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: '',
      }),
    });

    await getDocument({
      applicationContext,
      protocol: 'S3',
      useTempBucket: true,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: tempBucketName });
  });

  it('retrieves from the documents bucket by default when S3 protocol is set', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: '',
      }),
    });

    await getDocument({
      applicationContext,
      protocol: 'S3',
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: 'DocumentBucketName' });
  });
});
