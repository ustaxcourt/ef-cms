exports.saveDocumentFromLambda = ({
  applicationContext,
  document: body,
  documentId: key,
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
      ContentType: 'application/pdf',
      Key: key,
    })
    .promise();
};
