const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentWorkItemsForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/outbox`,
  });
};
