import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const closeTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<void> => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/close`,
  });
};
