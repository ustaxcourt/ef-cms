import { post } from '../requests';

export const getHealthCheckAndSetCacheProxy = applicationContext => {
  return post({
    applicationContext,
    endpoint: '/async/public-api/health-check-cache',
  });
};
