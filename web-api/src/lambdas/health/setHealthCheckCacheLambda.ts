import { genericHandler } from '@web-api/genericHandler';
import { setHealthCheckCacheInteractor } from '@web-api/business/useCases/health/setHealthCheckCacheInteractor';

export const setHealthCheckCacheLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await setHealthCheckCacheInteractor(applicationContext);
  });
