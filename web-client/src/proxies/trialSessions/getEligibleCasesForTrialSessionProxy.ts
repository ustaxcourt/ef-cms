import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getEligibleCasesForTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/eligible-cases`,
  });
};
