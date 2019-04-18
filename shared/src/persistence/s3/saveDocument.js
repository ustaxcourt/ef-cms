exports.saveDocument = ({
  documentId: key,
  document: body,
  applicationContext,
}) => {
  return applicationContext
    .getStorageClient()
    .putObject({
      Body: Buffer.from(body),
      Bucket: applicationContext.environment.documentsBucketName,
      ContentType: 'application/pdf',
      Key: key,
    })
    .promise();
};
