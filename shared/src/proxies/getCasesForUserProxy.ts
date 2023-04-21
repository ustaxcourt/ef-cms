import { get } from './requests';

/**
 * getCasesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getCasesForUserInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/cases',
  });
};
