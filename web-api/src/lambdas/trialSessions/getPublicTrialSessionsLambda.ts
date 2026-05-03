import { genericHandler } from '@web-api/genericHandler';
import { getPublicTrialSessionsInteractor } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionsInteractor';

export const getPublicTrialSessionsLambda = event =>
  genericHandler(event, async () => {
    return await getPublicTrialSessionsInteractor();
  });
