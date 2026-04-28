import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCalendaredCasesForTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/get-calendared-cases`,
  });
};
