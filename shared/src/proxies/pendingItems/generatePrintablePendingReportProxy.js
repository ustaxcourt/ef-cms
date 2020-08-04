const { get } = require('../requests');

/**
 * generatePrintablePendingReportInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @param {string} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintablePendingReportInteractor = ({
  applicationContext,
  docketNumber,
  judge,
}) => {
  let queryString = '';

  if (docketNumber) {
    queryString = '?docketNumber=' + encodeURIComponent(docketNumber);
  } else if (judge) {
    queryString = '?judge=' + encodeURIComponent(judge);
  }
  return get({
    applicationContext,
    endpoint: `/reports/pending-report${queryString}`,
  });
};
