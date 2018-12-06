/**
 * getDownloadPolicyUrl
 * @param documentId
 * @param applicationContext
 */
exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
  if (!documentId) {
    throw new Error('documentId is required');
  }
  return  applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
    documentId,
    applicationContext,
  });
};
