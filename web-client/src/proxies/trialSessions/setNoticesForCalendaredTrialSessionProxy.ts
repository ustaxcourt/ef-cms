import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const setNoticesForCalendaredTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { clientConnectionId, trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      clientConnectionId,
    },
    endpoint: `/async/trial-sessions/${trialSessionId}/generate-notices`,
  });
};
