import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const addCaseToTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { calendarNotes, docketNumber, trialSessionId },
) => {
  return post({
    applicationContext,
    body: { calendarNotes },
    endpoint: `/trial-sessions/${trialSessionId}/cases/${docketNumber}`,
  });
};
