import { get } from '../requests';

export const getPublicTrialSessionDetailsInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/trial-sessions/${trialSessionId}`,
  });
};
