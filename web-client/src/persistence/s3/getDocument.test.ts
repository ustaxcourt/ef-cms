import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocument } from './getDocument';
import { getPdfFromUrl } from '@web-client/persistence/s3/getPdfFromUrl';

const BLOB_DATA = 'abc';
jest.mock('./getPdfFromUrl', () => ({
  getPdfFromUrl: jest.fn().mockReturnValue({
    name: 'mockfile.pdf',
  }),
}));

describe('getDocument', () => {
  const docketNumber = '101-19';
  const key = '123';

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
    } as any);

    expect((getPdfFromUrl as jest.Mock).mock.calls[0][0]).toMatchObject({
      url: mockPdfUrl,
    });
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
      docketNumber,
      key,
      protocol: 'S3',
      useTempBucket: false,
    });

    expect(applicationContext.getStorageClient().getObject).toHaveBeenCalled();
  });

  it('retrieves from the temp bucket when S3 protocol is set and useTempBucket is true', async () => {
    const tempBucketName = 'tempBucket';
    applicationContext.getTempDocumentsBucketName.mockReturnValue(
      tempBucketName,
    );
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Body: '',
        }),
    });

    await getDocument({
      applicationContext,
      docketNumber,
      key,
      protocol: 'S3',
      useTempBucket: true,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: tempBucketName, Key: key });
  });

  it('retrieves from the documents bucket by default when S3 protocol is set', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Body: '',
        }),
    });

    await getDocument({
      applicationContext,
      docketNumber,
      key,
      protocol: 'S3',
      useTempBucket: false,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: 'DocumentBucketName', Key: key });
  });
});
