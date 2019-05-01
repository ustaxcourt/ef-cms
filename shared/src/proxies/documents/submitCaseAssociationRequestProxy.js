const { put } = require('../requests');

/**
 * submitCaseAssociationRequestProxy
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitCaseAssociationRequest = ({ caseId, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}`,
  });
};
