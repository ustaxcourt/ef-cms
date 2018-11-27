exports.createUploadPolicy = ({ applicationContext }) => {
  return applicationContext.persistence.createUploadPolicy({
    applicationContext,
  });
};
