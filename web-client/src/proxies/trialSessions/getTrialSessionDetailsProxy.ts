import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTrialSessionDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<RawTrialSession> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
