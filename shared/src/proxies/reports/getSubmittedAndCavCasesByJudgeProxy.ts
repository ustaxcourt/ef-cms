import { post } from '../requests';

/**
 * getCasesClosedByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the end date for the report query
 * @param {string} providers.judgeName the judge name for the report query
 * @param {string} providers.startDate the start date for the report query
 * @returns {Promise<*>} the promise of the api call
 */
export const getSubmittedAndCavCasesByJudgeInteractor = (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
    statuses,
  }: {
    startDate: string;
    endDate: string;
    judgeName: string;
    statuses: string[];
  },
) => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeName,
      startDate,
      statuses,
    },
    endpoint: '/judge-activity-report/open-cases',
  });
};
