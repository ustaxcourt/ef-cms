import { get } from '../requests';

/**
 * getPublicJudgesProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @returns {Promise<*>} the promise of the api call
 */
export const getPublicJudgesInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/judges',
  });
};
