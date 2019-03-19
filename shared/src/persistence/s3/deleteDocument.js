exports.deleteDocument = ({ key, applicationContext }) => {
  return applicationContext
    .getStorageClient()
    .deleteObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();
};
