const { get } = require('./requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getConsolidatedCasesByCaseInteractor = ({
  applicationContext,
  caseId,
}) => {
  return get({
    applicationContext,
    endpoint: `/cases/${caseId}/consolidated-cases`,
  });
};
