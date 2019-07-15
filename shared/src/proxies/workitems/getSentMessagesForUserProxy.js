const { get } = require('../requests');

/**
 *
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getSentMessagesForUserInteractor = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/api/users/${userId}/messages/sent`,
  });
};
