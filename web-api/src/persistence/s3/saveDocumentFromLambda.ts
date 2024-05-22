export const saveDocumentFromLambda = async ({
  applicationContext,
  contentType: ContentType = 'application/pdf',
  document: body,
  key,
  useTempBucket = false,
}: {
  applicationContext: IApplicationContext;
  contentType?: string;
  document: any;
  key: string;
  useTempBucket?: boolean;
}) => {
  let Bucket = applicationContext.environment.documentsBucketName;
  if (useTempBucket) {
    Bucket = applicationContext.environment.tempDocumentsBucketName;
  }

  const maxRetries = 1;

  let response;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      response = await applicationContext
        .getStorageClient()
        .putObject({
          Body: Buffer.from(body),
          Bucket,
          ContentType,
          Key: key,
        })
        .promise();
      break;
    } catch (err) {
      if (i >= maxRetries) {
        applicationContext.logger.error(
          'An error occurred while attempting to save the document',
          { error: err },
        );
        throw err;
      }
    }
  }

  return response;
};
