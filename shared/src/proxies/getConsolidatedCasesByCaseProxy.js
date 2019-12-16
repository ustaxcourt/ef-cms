const { get } = require('./requests');

/**
 * calls a proxy to retrieve cases with the passed lead case id
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseId the case's id to pass to the endpoint
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
