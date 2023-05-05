import { get } from '../requests';
import qs from 'qs';

/**
 * getNotificationsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseServicesSupervisorData optional caseServicesSupervisorData
 * @param {string} providers.judgeUserId optional judge user id to filter on
 * @returns {Promise<*>} the promise of the api call
 */
export const getNotificationsInteractor = (
  applicationContext,
  { caseServicesSupervisorData, judgeUserId },
) => {
  const queryString = qs.stringify({
    caseServicesSupervisorData,
    judgeUserId,
  });

  return get({
    applicationContext,
    endpoint: `/api/notifications?${queryString}`,
  });
};
