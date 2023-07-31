import { post } from '../requests';

export const getHealthCheckAndSetCache = applicationContext => {
  return post({
    applicationContext,
    endpoint: '/public-api/health-check-cache',
  });
};
