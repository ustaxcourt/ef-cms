const { get } = require('../requests');

/**
 * getCaseMessagesForCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseMessagesForCaseInteractor = ({ applicationContext, caseId }) => {
  return get({
    applicationContext,
    endpoint: `/messages/case/${caseId}`,
  });
};
