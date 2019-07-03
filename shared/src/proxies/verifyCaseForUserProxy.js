const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.verifyCaseForUserInteractor = ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}`,
  });
};
