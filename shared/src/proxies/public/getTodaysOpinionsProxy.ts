import { get } from '../requests';

/**
 * getTodaysOpinionsProxy
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getTodaysOpinionsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/todays-opinions',
  });
};
