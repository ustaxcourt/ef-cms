const { getDownloadPolicyUrl } = require('./getDownloadPolicyUrl');

describe('getDownloadPolicyUrl', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) => cb(null, 'http://localhost'),
      }),
      getDocumentsBucketName: () => 'my-test-bucket',
    };
    const result = await getDownloadPolicyUrl({
      applicationContext,
    });
    expect(result).toEqual({ url: 'http://localhost' });
  });

  it('rejects if an error is thrown', async () => {
    const applicationContext = {
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) => cb('error', 'http://localhost'),
      }),
      getDocumentsBucketName: () => 'my-test-bucket',
    };
    let error;
    try {
      await getDownloadPolicyUrl({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
