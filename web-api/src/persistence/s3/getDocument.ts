import { ServerApplicationContext } from '@web-api/applicationContext';

export const getDocument = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
  useTempBucket?: boolean;
}): Promise<Uint8Array> => {
  const response = await applicationContext.getStorageClient().getObject({
    Bucket: useTempBucket
      ? applicationContext.environment.tempDocumentsBucketName
      : applicationContext.environment.documentsBucketName,
    Key: key,
  });

  if (!response.Body) {
    throw new Error(`Unable to get document (${key}) from persistence.`);
  }

  return await response.Body.transformToByteArray();
};
