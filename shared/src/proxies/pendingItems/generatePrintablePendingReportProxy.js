const { get } = require('../requests');

/**
 * generatePrintablePendingReportInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the optional caseId filter
 * @param {string} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintablePendingReportInteractor = ({
  applicationContext,
  caseId,
  judge,
}) => {
  let queryString = '';

  if (caseId) {
    queryString = '?caseId=' + encodeURIComponent(caseId);
  } else if (judge) {
    queryString = '?judge=' + encodeURIComponent(judge);
  }
  return get({
    applicationContext,
    endpoint: `/api/pending-report${queryString}`,
  });
};
