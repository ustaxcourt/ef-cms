const { put } = require('./requests');

/**
 * setConsolidatedCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to consolidate
 * @param {object} providers.leadCaseId the id of the lead case for consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.setConsolidatedCaseInteractor = ({
  applicationContext,
  caseId,
  leadCaseId,
}) => {
  return put({
    applicationContext,
    body: { leadCaseId },
    endpoint: `/cases/${caseId}/consolidate-case`,
  });
};
