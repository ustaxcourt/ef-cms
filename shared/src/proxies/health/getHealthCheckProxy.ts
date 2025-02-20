import { ApplicationHealth } from '@web-api/business/useCases/health/getHealthCheckInteractor';
import { get } from '../requests';

/**
 * getHealthCheckInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getHealthCheckInteractor = (
  applicationContext,
): Promise<ApplicationHealth> => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
