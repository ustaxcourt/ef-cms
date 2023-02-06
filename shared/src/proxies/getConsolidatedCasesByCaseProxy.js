const { get } = require('./requests');

/**
 * calls a proxy to retrieve cases with the passed lead docket number
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number to pass to the endpoint
 * @returns {Promise<*>} the promise of the api call
 */
exports.getConsolidatedCasesByCaseInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/cases/${docketNumber}/consolidated-cases`,
  });
};
