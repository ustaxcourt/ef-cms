export const deleteDocumentFile = ({
  applicationContext,
  key,
}: {
  applicationContext: IApplicationContext;
  key: string;
}) => {
  return applicationContext
    .getStorageClient()
    .deleteObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();
};
