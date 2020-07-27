const { put } = require('./requests');

/**
 * addConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to consolidate
 * @param {object} providers.leadCaseId the id of the lead case for consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.addConsolidatedCaseInteractor = ({
  applicationContext,
  caseIdToConsolidateWith,
  docketNumber,
}) => {
  return put({
    applicationContext,
    body: { caseIdToConsolidateWith },
    endpoint: `/case-meta/${docketNumber}/consolidate-case`,
  });
};
