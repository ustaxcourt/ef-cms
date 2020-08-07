exports.saveDocumentFromLambda = ({
  applicationContext,
  contentType: ContentType = 'application/pdf',
  document: body,
  documentId: key,
  useTempBucket,
}) => {
  let Bucket = applicationContext.getDocumentsBucketName();
  if (useTempBucket) {
    Bucket = applicationContext.getTempDocumentsBucketName();
  }
  console.log('*_*_*_*_*_*_*_ we are in here', key, Bucket);
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
