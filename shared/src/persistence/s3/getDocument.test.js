const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getDocument } = require('./getDocument');
const { getPdfFromUrl } = require('./getPdfFromUrl');
const BLOB_DATA = 'abc';
jest.mock('./getPdfFromUrl', () => ({
  getPdfFromUrl: jest.fn().mockReturnValue({
    name: 'mockfile.pdf',
  }),
}));

describe('getDocument', () => {
  it('should return a file from the provided url when protocol is not provided', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext.getHttpClient.mockImplementation(() => {
      const httpClient = () => ({
        data: BLOB_DATA,
      });
      httpClient.get = () => ({
        data: { url: mockPdfUrl },
      });
      return httpClient;
    });

    const result = await getDocument({
      applicationContext,
    });

    expect(getPdfFromUrl.mock.calls[0][0]).toMatchObject({ url: mockPdfUrl });
    expect(result).toEqual({ name: 'mockfile.pdf' });
  });

  it('calls S3.getObject when S3 protocol is set', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      getObject: jest.fn().mockReturnValue({
        promise: () => ({ Body: null }),
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
