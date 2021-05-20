const qs = require('qs');
const { get } = require('../requests');

/**
 * generatePrintablePendingReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional docketNumber filter
 * @param {string} providers.judge the optional judge filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintablePendingReportInteractor = (
  applicationContext,
  { docketNumber, judge },
) => {
  const queryString = qs.stringify({ docketNumber, judge });

  return get({
    applicationContext,
    endpoint: `/reports/pending-report?${queryString}`,
  });
};
