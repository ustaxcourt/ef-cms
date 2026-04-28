import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
) => {
  return remove({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
