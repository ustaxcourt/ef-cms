import { get } from '../requests';

/**
 * getTodaysOrdersInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.sortOrder the requested order of search results
 * @returns {Promise<*>} the promise of the api call
 */
export const getTodaysOrdersInteractor = (
  applicationContext,
  { page, todaysOrdersSort },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/todays-orders/${page}/${todaysOrdersSort}`,
  });
};
