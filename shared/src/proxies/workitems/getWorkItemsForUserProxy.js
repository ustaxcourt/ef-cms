const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItemsForUser = ({ userId, applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/inbox`,
  });
};
