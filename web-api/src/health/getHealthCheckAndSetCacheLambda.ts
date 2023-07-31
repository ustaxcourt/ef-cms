import { genericHandler } from '../genericHandler';

export const getHealthCheckAndSetCacheLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .getHealthCheckAndSetCache(applicationContext);
  });
