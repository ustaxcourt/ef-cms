const { get } = require('../requests');

/**
 * getCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the message id
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseMessageInteractor = ({ applicationContext, messageId }) => {
  return get({
    applicationContext,
    endpoint: `/messages/${messageId}`,
  });
};
