import { get } from '../requests';

export const getCachedHealthCheckInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/cached-health',
  });
};
