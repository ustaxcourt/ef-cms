import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';

export const createTrialSessionInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSession },
): Promise<RawTrialSession> => {
  return post({
    applicationContext,
    body: trialSession,
    endpoint: '/trial-sessions',
  });
};
