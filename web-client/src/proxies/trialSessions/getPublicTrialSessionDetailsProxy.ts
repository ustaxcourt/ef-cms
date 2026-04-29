import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { RequestApplicationContext, get } from '../requests';

export const getPublicTrialSessionDetailsInteractor = (
  applicationContext: RequestApplicationContext,
  { trialSessionId },
): Promise<PublicTrialSessionDetails> => {
  return get({
    applicationContext,
    endpoint: `/public-api/trial-sessions/${trialSessionId}`,
  });
};
