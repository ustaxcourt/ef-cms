import { ServerApplicationContext } from '@web-api/applicationContext';

export const isFileExists = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
  useTempBucket?: boolean;
}): Promise<boolean> => {
  try {
    await applicationContext.getStorageClient().headObject({
      Bucket: useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: key,
    });
    return true;
  } catch (headErr) {
    return false;
  }
};
