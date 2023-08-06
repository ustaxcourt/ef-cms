import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocument } from './getDocument';

describe('getDocument', () => {
  const key = '123';

  it('calls S3.getObject when S3 protocol is set', async () => {
    applicationContext.getStorageClient.mockReturnValue({
      getObject: jest.fn().mockReturnValue({
        promise: () => ({ Body: null }),
      }),
    });
    await getDocument({
      applicationContext,
      key,
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
      key,
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
      key,
      useTempBucket: false,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: 'DocumentBucketName', Key: key });
  });
});
