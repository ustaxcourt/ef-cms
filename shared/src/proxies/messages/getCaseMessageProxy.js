const { get } = require('../requests');

/**
 * getCaseMessageInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {string} providers.messageId the message id
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseMessageInteractor = ({
  applicationContext,
  caseId,
  messageId,
}) => {
  return get({
    applicationContext,
    endpoint: `/messages/${caseId}/${messageId}`,
  });
};
