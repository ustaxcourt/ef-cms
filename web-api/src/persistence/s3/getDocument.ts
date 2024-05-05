import { ServerApplicationContext } from '@web-api/applicationContext';

export const getDocument = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
  useTempBucket?: boolean;
}) => {
  const response = await applicationContext.getStorageClient().getObject({
    Bucket: useTempBucket
      ? applicationContext.environment.tempDocumentsBucketName
      : applicationContext.environment.documentsBucketName,
    Key: key,
  });

  return response.Body;
};
