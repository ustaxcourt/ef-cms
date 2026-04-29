import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const updateTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  {
    clientConnectionId,
    trialSession,
  }: { clientConnectionId: string; trialSession: RawTrialSession },
): Promise<void> => {
  return put({
    applicationContext,
    body: {
      clientConnectionId,
      trialSession,
    },
    endpoint: '/async/trial-sessions',
  });
};
