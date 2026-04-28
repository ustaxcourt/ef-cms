import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionWorkingCopyInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/working-copy`,
  });
};
