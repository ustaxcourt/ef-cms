import { genericHandler } from '../../genericHandler';

export const startPollingForResultsLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .startPollingForResultsInteractor(applicationContext, {
        ...event.pathParameters,
      });
  });
