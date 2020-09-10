const { post } = require('../requests');

/**
 * setMessageAsReadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to set as read
 * @returns {Promise<*>} the promise of the api call
 */
exports.setMessageAsReadInteractor = ({ applicationContext, messageId }) => {
  return post({
    applicationContext,
    endpoint: `/messages/${messageId}/read`,
  });
};
