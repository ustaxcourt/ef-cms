exports.saveDocument = ({
  applicationContext,
  document: body,
  documentId: key,
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
