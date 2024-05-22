import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocument } from './getDocument';

describe('getDocument', () => {
  const key = '123';

  it('should retrieve the specified document from the temp bucket when useTempBucket is true', async () => {
    const tempBucketName = 'tempBucket';
    applicationContext.environment.tempDocumentsBucketName = tempBucketName;
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

  it('should retrieve the specified document from the documents bucket by default', async () => {
    const documentsBucketName = 'regularDocumentBucket';
    applicationContext.environment.documentsBucketName = documentsBucketName;
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Body: '',
        }),
    });

    await getDocument({
      applicationContext,
      key,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: documentsBucketName, Key: key });
  });
});
