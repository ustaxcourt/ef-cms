const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentWorkItemsForUser = ({ userId, applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/outbox`,
  });
};
