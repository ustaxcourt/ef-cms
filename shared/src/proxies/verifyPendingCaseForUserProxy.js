const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.verifyPendingCaseForUserInteractor = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/api/users/${user.userId}/case/${caseId}/pending`,
  });
};
