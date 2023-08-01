import { applicationContextPublic as applicationContext } from '../../../../web-client/src/applicationContextPublic';
import { post } from '../requests';

export const getHealthCheckAndSetCacheProxy = () => {
  return post({
    applicationContext,
    endpoint: '/async/public-api/health-check-cache',
  });
};
