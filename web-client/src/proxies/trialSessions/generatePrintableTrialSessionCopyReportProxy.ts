import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const generatePrintableTrialSessionCopyReportInteractor = (
  applicationContext: ClientApplicationContext,
  {
    filters,
    formattedCases,
    formattedTrialSession,
    sessionNotes,
    showCaseNotes,
    sort,
    trialSessionId,
    userHeading,
    trialStatusCounts,
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
      trialStatusCounts,
    },
    endpoint: `/trial-sessions/${trialSessionId}/printable-working-copy`,
  });
};
