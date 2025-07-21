import { genericHandler } from '../../genericHandler';
import { getPublicTrialSessionDetailsInteractor } from '@web-api/business/useCases/trialSessions/getPublicTrialSessionDetailsInteractor';

export const getPublicTrialSessionDetailsLambda = event =>
  genericHandler(event, () =>
    getPublicTrialSessionDetailsInteractor({
      trialSessionId: event.pathParameters.trialSessionId,
    }),
  );
