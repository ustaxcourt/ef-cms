import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { get } from '../requests';

export const getPublicTrialSessionDetailsInteractor = (
  applicationContext,
  { trialSessionId },
): Promise<PublicTrialSessionDetails> => {
  return get({
    applicationContext,
    endpoint: `/public-api/trial-sessions/${trialSessionId}`,
  });
};
