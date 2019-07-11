const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param caseId
 * @returns {Promise<*>}
 */
exports.verifyCaseForUser = ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}`,
  });
};
