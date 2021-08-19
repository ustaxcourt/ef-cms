exports.saveDocumentFromLambda = async ({
  applicationContext,
  contentType: ContentType = 'application/pdf',
  document: body,
  key,
  useTempBucket,
}) => {
  let Bucket = applicationContext.getDocumentsBucketName();
  if (useTempBucket) {
    Bucket = applicationContext.getTempDocumentsBucketName();
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
