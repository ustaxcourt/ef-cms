exports.getDocumentDownloadUrl = ({ documentId, applicationContext } = {}) => {
  if (!documentId) {
    throw new Error('documentId is required');
  }
  return applicationContext.persistence.getDocumentDownloadUrl({
    documentId,
    applicationContext,
  });
};
