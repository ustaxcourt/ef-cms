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
  {
    filters,
    formattedCases,
    formattedTrialSession,
    nameToDisplay,
    trialSessionId,
  },
) => {
  return post({
    applicationContext,
    body: {
      filters,
      formattedCases,
      formattedTrialSession,
      nameToDisplay,
    },
    endpoint: `/trial-sessions/${trialSessionId}/printable-working-copy`,
  });
};
