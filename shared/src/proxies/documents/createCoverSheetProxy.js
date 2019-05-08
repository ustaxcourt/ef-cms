const { post } = require('../requests');

/**
 * createCoverSheet
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.createCoverSheet = ({ caseId, documentId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/documents/${documentId}/coversheet`,
  });
};
