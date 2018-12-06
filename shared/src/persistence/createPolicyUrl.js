/**
 * createUploadPolicy
 * @param applicationContext
 */
exports.createUploadPolicy = ({ applicationContext }) => {
  return  applicationContext.getPersistenceGateway().createUploadPolicy({
    applicationContext,
  });
};
