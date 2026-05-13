import { RawEligibleCase } from '@shared/business/entities/cases/EligibleCase';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getEligibleCasesForTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<RawEligibleCase[]> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/eligible-cases`,
  });
};
