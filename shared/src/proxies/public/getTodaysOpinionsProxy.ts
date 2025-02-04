import { applicationContextPublic } from '@web-client/applicationContextPublic';
import { get } from '../requests';

/**
 * getTodaysOpinionsProxy
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
export const getTodaysOpinionsInteractor = async (): Promise<any[]> => {
  await new Promise(resolve => setTimeout(resolve, 5000));
  return get({
    applicationContext: applicationContextPublic,
    endpoint: '/public-api/todays-opinions',
  });
};
