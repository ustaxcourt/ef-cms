exports.deleteDocument = ({ applicationContext, key }) => {
  return applicationContext
    .getStorageClient()
    .deleteObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();
};
