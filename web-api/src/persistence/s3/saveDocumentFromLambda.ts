import { ServerApplicationContext } from '@web-api/applicationContext';

export const saveDocumentFromLambda = async ({
  applicationContext,
  contentType: ContentType = 'application/pdf',
  document: body,
  key,
  useTempBucket = false,
}: {
  applicationContext: ServerApplicationContext;
  contentType?: string;
  document: any;
  key: string;
  useTempBucket?: boolean;
}): Promise<void> => {
  let Bucket = applicationContext.environment.documentsBucketName;
  if (useTempBucket) {
    Bucket = applicationContext.environment.tempDocumentsBucketName;
  }

  const maxRetries = 1;

  for (let i = 0; i <= maxRetries; i++) {
    try {
      await applicationContext.getStorageClient().putObject({
        Body: Buffer.from(body),
        Bucket,
        ContentType,
        Key: key,
      });
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
};
