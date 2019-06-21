const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItemsForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/inbox`,
  });
};
