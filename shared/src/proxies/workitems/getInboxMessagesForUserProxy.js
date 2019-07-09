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
    endpoint: `/api/users/${userId}/messages/inbox`,
  });
};
