import { applicationContext } from '../../../../web-client/src/applicationContext';
import { post } from '../requests';

export const getHealthCheckAndSetCacheProxy = () => {
  return post({
    applicationContext,
    endpoint: '/async/public-api/health-check-cache',
  });
};
