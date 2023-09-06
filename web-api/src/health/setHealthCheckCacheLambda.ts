import { genericHandler } from '../genericHandler';

export const setHealthCheckCacheLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await applicationContext
      .getUseCases()
      .setHealthCheckCacheInteractor(applicationContext);
  });
