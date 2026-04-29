import { ApplicationHealth } from '@web-api/business/useCases/health/getHealthCheckInteractor';
import { get } from '../requests';

export const getHealthCheckInteractor = (
  applicationContext,
): Promise<ApplicationHealth> => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
