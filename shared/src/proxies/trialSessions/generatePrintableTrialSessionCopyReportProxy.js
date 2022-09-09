const qs = require('qs');
const { get } = require('../requests');

/**
 * generatePrintableTrialSessionCopyReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional trialSessionId filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintablePendingReportInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  const queryString = qs.stringify({ trialSessionId });

  return get({
    applicationContext,
    endpoint: `/reports/pending-report?${queryString}`,
  });
};
