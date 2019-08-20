const { get } = require('../requests');

/**
 * getInboxMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the inbox messages
 * @returns {Promise<*>} the promise of the api call
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
