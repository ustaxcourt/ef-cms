import { ServerApplicationContext } from '@web-api/applicationContext';

export const deleteDocumentFile = ({
  applicationContext,
  key,
}: {
  applicationContext: ServerApplicationContext;
  key: string;
}) => {
  return applicationContext.getStorageClient().deleteObject({
    Bucket: applicationContext.environment.documentsBucketName,
    Key: key,
  });
};
