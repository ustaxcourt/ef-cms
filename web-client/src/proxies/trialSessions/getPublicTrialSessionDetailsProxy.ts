import type { RawPublicTrialSessionDetails } from '@shared/business/entities/trialSessions/PublicTrialSessionDetails';
import { RequestApplicationContext, get } from '../requests';

export const getPublicTrialSessionDetailsInteractor = (
  applicationContext: RequestApplicationContext,
  { trialSessionId },
): Promise<RawPublicTrialSessionDetails> => {
  return get({
    applicationContext,
    endpoint: `/public-api/trial-sessions/${trialSessionId}`,
  });
};
