const { getPublicDownloadPolicyUrl } = require('./getPublicDownloadPolicyUrl');

describe('getPublicDownloadPolicyUrl', () => {
  it('calls the s3 getSignedUrl method with the given documentId returning a URL', async () => {
    const documentId = '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1';
    const applicationContext = {
      getDocumentsBucketName: () => 'my-test-bucket',
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) =>
          cb(null, `http://example.com/document/${options.Key}`),
      }),
    };
    const result = await getPublicDownloadPolicyUrl({
      applicationContext,
      documentId,
    });
    expect(result).toEqual({
      url: `http://example.com/document/${documentId}`,
    });
  });

  it('rejects if an error is thrown', async () => {
    const documentId = '19eeab4c-f7d8-46bd-90da-fbfa8d6e71d1';
    const applicationContext = {
      getDocumentsBucketName: () => 'my-test-bucket',
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) =>
          cb('error', `http://example.com/document/${options.documentId}`),
      }),
    };
    let error;
    try {
      await getPublicDownloadPolicyUrl({
        applicationContext,
        documentId,
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
