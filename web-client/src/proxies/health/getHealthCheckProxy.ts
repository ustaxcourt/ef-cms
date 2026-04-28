import { get } from '../requests';

export const getHealthCheckInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
