const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentMessagesForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/messages/sent`,
  });
};
