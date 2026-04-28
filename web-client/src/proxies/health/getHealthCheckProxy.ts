import { get } from '../requests';

/**
 * getHealthCheckInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getHealthCheckInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/health',
  });
};
