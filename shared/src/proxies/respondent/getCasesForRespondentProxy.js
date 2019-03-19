const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesForRespondent = ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/respondents/${user.userId}/cases`,
  });
};
