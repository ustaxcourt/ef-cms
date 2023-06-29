import { post } from '../requests';

/**
 * generatePrintableTrialSessionCopyReportInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the optional trialSessionId filter
 * @returns {Promise<*>} the promise of the api call
 */
export const generatePrintableTrialSessionCopyReportInteractor = (
  applicationContext,
  {
    filters,
    formattedCases,
    formattedTrialSession,
    sessionNotes,
    showCaseNotes,
    sort,
    trialSessionId,
    userHeading,
  },
) => {
  return post({
    applicationContext,
    body: {
      filters,
      formattedCases,
      formattedTrialSession,
      sessionNotes,
      showCaseNotes,
      sort,
      userHeading,
    },
    endpoint: `/trial-sessions/${trialSessionId}/printable-working-copy`,
  });
};
