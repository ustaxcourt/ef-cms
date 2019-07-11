const { post } = require('../requests');

/**
 * createCoverSheet
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCoverSheet = ({ applicationContext, caseId, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/documents/${documentId}/coversheet`,
  });
};
