const { post } = require('../requests');

/**
 * submitCaseAssociationRequestProxy
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitCaseAssociationRequest = ({ caseId, applicationContext }) => {
  return post({
    applicationContext,
    body: {
      caseId,
    },
    endpoint: `/cases/${caseId}/practitioner-association`,
  });
};
