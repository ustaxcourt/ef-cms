const { put } = require('./requests');

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the lead case for consolidation
 * @param {object} providers.docketNumberToConsolidateWith the docket number of the case to consolidate
 * @returns {Promise<*>} the promise of the api call
 */
exports.addConsolidatedCaseInteractor = (
  applicationContext,
  { docketNumber, docketNumberToConsolidateWith },
) => {
  return put({
    applicationContext,
    body: { docketNumberToConsolidateWith },
    endpoint: `/case-meta/${docketNumber}/consolidate-case`,
  });
};
