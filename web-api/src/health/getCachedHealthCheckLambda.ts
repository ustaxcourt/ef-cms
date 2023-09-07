import { genericHandler } from '../genericHandler';

export const getCachedHealthCheckLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getCachedHealthCheckInteractor(applicationContext);
  });
