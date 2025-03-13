import { get } from '../requests';

/**
 * getCaseDeadlinesInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the end date
 * @param {string} providers.startDate the start date
 * @returns {Promise<*>} the promise of the api call
 */
export const getCaseDeadlinesInteractor = (
  applicationContext,
  { endDate, from, judge, startDate },
) => {
  return get({
    applicationContext,
    endpoint: '/case-deadlines',
    params: {
      endDate,
      from,
      judge,
      startDate,
    },
  });
};
