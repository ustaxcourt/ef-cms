const { get } = require('../requests');

/**
 * getCaseMessageThreadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseMessageThreadInteractor = ({
  applicationContext,
  parentMessageId,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/${parentMessageId}`,
  });
};
