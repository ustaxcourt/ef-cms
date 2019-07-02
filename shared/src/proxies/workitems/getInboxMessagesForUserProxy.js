const { get } = require('../requests');

/**
 * getInboxMessagesForUserProxy
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForUser = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/messages/inbox`,
  });
};
