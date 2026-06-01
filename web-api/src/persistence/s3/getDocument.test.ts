import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getDocument } from './getDocument';

describe('getDocument', () => {
  const key = '123';

  it('should retrieve the specified document from the temp bucket when useTempBucket is true', async () => {
    const tempBucketName = 'tempBucket';
    applicationContext.environment.tempDocumentsBucketName = tempBucketName;

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

    await getDocument({
      applicationContext,
      key,
    });

    expect(
      applicationContext.getStorageClient().getObject,
    ).toHaveBeenCalledWith({ Bucket: documentsBucketName, Key: key });
  });

  it('should throw an error when the storage client returns a response with no Body', async () => {
    (applicationContext.getStorageClient().getObject as jest.Mock)
      .mockResolvedValueOnce({});

    await expect(
      getDocument({
        applicationContext,
        key,
      }),
    ).rejects.toThrow(`Unable to get document (${key}) from persistence.`);
  });
});
