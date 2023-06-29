import { getResponse } from '../requests';

/**
 * getMaintenanceModePublicInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const getMaintenanceModePublicInteractor = applicationContext =>
  getResponse({
    applicationContext,
    endpoint: '/public-api/maintenance-mode',
  });
