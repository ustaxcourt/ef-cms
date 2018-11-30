/**
 * createUploadPolicy
 * @param applicationContext
 */
exports.createUploadPolicy = ({ applicationContext }) => {
  return applicationContext.persistence.createUploadPolicy({
    applicationContext,
  });
};
