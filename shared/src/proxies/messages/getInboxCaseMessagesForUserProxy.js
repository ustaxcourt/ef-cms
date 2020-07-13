const { get } = require('../requests');

/**
 * getInboxCaseMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.getInboxCaseMessagesForUserInteractor = ({
  applicationContext,
  userId,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/inbox/${userId}`,
  });
};
