const { get } = require('./requests');

/**
 * getCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to retrieve
 * @returns {Promise<*>} the promise of the api call
 */
exports.getCaseInteractor = ({ applicationContext, caseId }) => {
  return get({
    applicationContext,
    endpoint: `/cases/${caseId}`,
  });
};
