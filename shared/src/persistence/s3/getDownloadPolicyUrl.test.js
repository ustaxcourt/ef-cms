const { getDownloadPolicyUrl } = require('./getDownloadPolicyUrl');

let applicationContext;
let getTempDocumentsBucketNameMock;
let getDocumentsBucketNameMock;

describe('getDownloadPolicyUrl', () => {
  beforeEach(() => {
    getTempDocumentsBucketNameMock = jest.fn(() => 'my-test-temp-bucket');
    getDocumentsBucketNameMock = jest.fn(() => 'my-test-bucket');

    applicationContext = {
      getDocumentsBucketName: getDocumentsBucketNameMock,
      getStorageClient: () => ({
        getSignedUrl: (method, options, cb) => cb(null, 'http://localhost'),
      }),
      getTempDocumentsBucketName: getTempDocumentsBucketNameMock,
    };
  });

  it('returns a signed URL from the storage client (s3)', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
    });
    expect(result).toEqual({ url: 'http://localhost' });
    expect(getDocumentsBucketNameMock).toHaveBeenCalled();
  });

  it('returns a signed URL from the storage client using the temp bucket when the useTempBucket param is true', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      useTempBucket: true,
    });
    expect(result).toEqual({ url: 'http://localhost' });
    expect(getTempDocumentsBucketNameMock).toHaveBeenCalled();
  });

  it('rejects if an error is thrown', async () => {
    applicationContext.getStorageClient = () => ({
      getSignedUrl: (method, options, cb) => cb('error', 'http://localhost'),
    });

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
