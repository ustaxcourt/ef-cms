import { remove } from '../requests';

/**
 * deleteAuthCookieInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const deleteAuthCookieInteractor = applicationContext => {
  return remove({
    applicationContext,
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
