const { get } = require('../requests');

/**
 * getInboxMessagesForUserInteractor
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/messages/inbox`,
  });
};
