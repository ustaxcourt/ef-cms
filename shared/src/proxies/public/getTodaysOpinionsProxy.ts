import { applicationContextPublic } from '@web-client/applicationContextPublic';
import { get } from '../requests';

/**
 * getTodaysOpinionsProxy
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getTodaysOpinionsInteractor = async (): Promise<any[]> => {
  return get({
    applicationContext: applicationContextPublic,
    endpoint: '/public-api/todays-opinions',
  });
};
