export const getDocument = async ({
  applicationContext,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  key: string;
  useTempBucket?: boolean;
}): Promise<Buffer> => {
  const document = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: useTempBucket
        ? applicationContext.environment.tempDocumentsBucketName
        : applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  if (!document.Body) {
    throw new Error(`Document is empty. Document id is: ${key}`);
  }
  return document.Body as Buffer;
};
