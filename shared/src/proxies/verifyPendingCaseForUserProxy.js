const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.verifyPendingCaseForUser = ({ caseId, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}/pending`,
  });
};
