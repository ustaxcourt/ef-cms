const { getUploadPolicy } = require('./getUploadPolicy');

describe('getUploadPolicy', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      getStorageClient: () => ({
        createPresignedPost: (options, cb) => cb(null, 'http://localhost'),
      }),
      getDocumentsBucketName: () => 'my-test-bucket',
    };
    const result = await getUploadPolicy({
      applicationContext,
    });
    expect(result).toEqual('http://localhost');
  });

  it('rejects if an error is thrown', async () => {
    const applicationContext = {
      getStorageClient: () => ({
        createPresignedPost: (options, cb) => cb('error', 'http://localhost'),
      }),
      getDocumentsBucketName: () => 'my-test-bucket',
    };
    let error;
    try {
      await getUploadPolicy({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
