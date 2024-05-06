import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDownloadPolicyUrl } from './getDownloadPolicyUrl';

describe('getDownloadPolicyUrl', () => {
  const getSignedUrlErrorMock = jest.fn((method, options, cb) =>
    cb('error', 'http://localhost'),
  );
  const getSignedUrlMock = jest.fn((method, options, cb) =>
    cb(null, 'http://localhost'),
  );
  const defaultBucketName = 'aBucket';
  const tempBucketName = 'aTempBucket';

  beforeAll(() => {
    applicationContext.getStorageClient.mockReturnValue({
      getSignedUrl: getSignedUrlMock,
    });
    applicationContext.environment.documentsBucketName = defaultBucketName;
    applicationContext.environment.tempDocumentsBucketName = tempBucketName;
  });

  it('returns a signed URL from the storage client (s3)', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: 'file.pdf',
      key: '123',
    });

    expect(result).toEqual({ url: 'http://localhost' });
    expect(getSignedUrlMock.mock.calls[0][1].Bucket).toEqual(defaultBucketName);
  });

  it('returns a signed URL from the storage client using the temp bucket when the useTempBucket param is true', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: 'test.pdf',
      key: '123',
      useTempBucket: true,
    });

    expect(result).toEqual({ url: 'http://localhost' });
    expect(getSignedUrlMock.mock.calls[0][1].Bucket).toEqual(tempBucketName);
  });

  it('should return a URL intended for viewing inline in a web browser when filename has NOT been provided', async () => {
    const result = await getDownloadPolicyUrl({
      applicationContext,
      filename: undefined,
      key: '123',
      useTempBucket: true,
    });

    expect(result).toEqual({ url: 'http://localhost' });
  });

  it('rejects if an error is thrown', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      getSignedUrl: getSignedUrlErrorMock,
    });

    await expect(
      getDownloadPolicyUrl({
        applicationContext,
        filename: 'test.pdf',
        key: '123',
        useTempBucket: false,
      }),
    ).rejects.toThrow('error');
  });
});
