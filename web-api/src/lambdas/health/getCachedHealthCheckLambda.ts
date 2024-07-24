import { genericHandler } from '@web-api/genericHandler';
import { getCachedHealthCheckInteractor } from '@web-api/business/useCases/health/getCachedHealthCheckInteractor';

export const getCachedHealthCheckLambda = event =>
  genericHandler(event, async ({ applicationContext }) => {
    return await getCachedHealthCheckInteractor(applicationContext);
  });
