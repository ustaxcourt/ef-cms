import { get } from '../requests';

/**
 * getMaintenanceModeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const getMaintenanceModeInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/system/maintenance-mode',
  });
};
