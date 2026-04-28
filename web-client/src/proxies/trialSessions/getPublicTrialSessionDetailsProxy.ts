import { PublicTrialSessionDetails } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicTrialSessionDetailsInteractor = (
  applicationContext: ClientApplicationContext,
  { trialSessionId },
): Promise<PublicTrialSessionDetails> => {
  return get({
    applicationContext,
    endpoint: `/public-api/trial-sessions/${trialSessionId}`,
  });
};
