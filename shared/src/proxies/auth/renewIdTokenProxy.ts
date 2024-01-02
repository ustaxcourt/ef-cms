import { post } from '../requests';

/**
 * renewIdTokenInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const renewIdTokenInteractor = applicationContext => {
  return post({
    applicationContext,
    endpoint: '/auth/refresh',
    options: {
      withCredentials: true,
    },
  });
};
