import { RawCalendaredCase } from '@shared/business/entities/cases/CalendaredCase';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getCalendaredCasesForTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<RawCalendaredCase[]> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/get-calendared-cases`,
  });
};
