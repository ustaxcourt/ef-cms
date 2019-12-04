const { getPublicDownloadPolicyUrl } = require('./getPublicDownloadPolicyUrl');

describe('getPublicDownloadPolicyUrl', () => {
  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      getDocumentsBucketName: () => 'my-test-bucket',
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) => cb(null, 'http://localhost'),
      }),
    };
    const result = await getPublicDownloadPolicyUrl({
      applicationContext,
    });
    expect(result).toEqual({ url: 'http://localhost' });
  });

  it('rejects if an error is thrown', async () => {
    const applicationContext = {
      getDocumentsBucketName: () => 'my-test-bucket',
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) => cb('error', 'http://localhost'),
      }),
    };
    let error;
    try {
      await getPublicDownloadPolicyUrl({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
