const { put } = require('../requests');

/**
 * submitPendingCaseAssociationRequest
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitPendingCaseAssociationRequest = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}/pending`,
  });
};
