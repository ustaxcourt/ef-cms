const { post } = require('../requests');

/**
 * signDocument
 *
 * @param caseId
 * @param document
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.signDocument = ({
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
