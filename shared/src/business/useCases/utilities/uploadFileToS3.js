exports.uploadFileToS3 = ({ applicationContext, document }) => {
  return applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    document,
  });
};
