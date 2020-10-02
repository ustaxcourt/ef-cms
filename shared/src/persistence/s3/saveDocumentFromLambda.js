exports.saveDocumentFromLambda = ({
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
  return applicationContext
    .getStorageClient()
    .putObject({
      Body: Buffer.from(body),
      Bucket,
      ContentType,
      Key: key,
    })
    .promise();
};
