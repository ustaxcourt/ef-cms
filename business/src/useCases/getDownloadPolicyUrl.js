exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
  if (!documentId) {
    throw new Error('documentId is required');
  }
  return applicationContext.persistence.getDownloadPolicyUrl({
    documentId,
    applicationContext,
  });
};
