const { post } = require('../requests');

/**
 * signDocumentInteractor
 *
 * @param caseId
 * @param document
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.signDocumentInteractor = ({
  applicationContext,
  caseId,
  originalDocumentId,
  signedDocumentId,
}) => {
  return post({
    applicationContext,
    body: {
      signedDocumentId,
    },
    endpoint: `/cases/${caseId}/documents/${originalDocumentId}/sign`,
  });
};
