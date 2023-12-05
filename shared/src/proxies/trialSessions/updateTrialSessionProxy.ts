import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import { put } from '../requests';

/**
 * updateTrialSessionInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
export const updateTrialSessionInteractor = (
  applicationContext,
  {
    clientConnectionId,
    trialSession,
  }: { clientConnectionId: string; trialSession: RawTrialSession },
) => {
  return put({
    applicationContext,
    body: {
      clientConnectionId,
      trialSession,
    },
    endpoint: '/async/trial-sessions',
  });
};
