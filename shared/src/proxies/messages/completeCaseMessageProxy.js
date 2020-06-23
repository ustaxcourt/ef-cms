const { post } = require('../requests');

/**
 * completeCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {Promise<*>} the promise of the api call
 */
exports.completeCaseMessageInteractor = ({
  applicationContext,
  message,
  parentMessageId,
}) => {
  return post({
    applicationContext,
    body: {
      message,
    },
    endpoint: `/messages/${parentMessageId}/complete`,
  });
};
