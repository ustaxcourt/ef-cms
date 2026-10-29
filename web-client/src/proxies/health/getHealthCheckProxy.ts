import { HealthCheckResponse } from '@shared/business/dto/public/HealthCheckResponse';
import { get } from '../requests';

export const getHealthCheckInteractor = (
  applicationContext,
): Promise<HealthCheckResponse> => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
