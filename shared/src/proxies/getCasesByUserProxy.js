const { get } = require('./requests');

/**
 *
 * @param applicationContext
 * @param userId
 * @returns {Promise<*>}
 */
exports.getCasesByUserInteractor = ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/api/users/${user.userId}/cases`,
  });
};
