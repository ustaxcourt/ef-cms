const { get } = require('../requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the sent messages
 * @returns {Promise<*>} the promise of the api call
 */
exports.getSentMessagesForUserInteractor = ({ applicationContext, userId }) => {
  return get({
    applicationContext,
    endpoint: `/users/${userId}/messages/sent`,
  });
};
