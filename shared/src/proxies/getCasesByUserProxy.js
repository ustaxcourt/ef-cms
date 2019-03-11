const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesByUser = ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/cases`,
  });
};
