import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deleteTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<RawTrialSession> => {
  return remove({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
