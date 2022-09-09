const { post } = require('../requests');

/**
 * generatePrintableTrialSessionCopyReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional trialSessionId filter
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePrintableTrialSessionCopyReportInteractor = (
  applicationContext,
  { formattedCases, formattedTrialSession, trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      formattedCases,
      formattedTrialSession,
    },
    endpoint: `/trial-sessions/${trialSessionId}/printable-working-copy`,
  });
};
