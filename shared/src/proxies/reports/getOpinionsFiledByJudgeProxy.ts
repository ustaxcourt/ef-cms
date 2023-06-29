import { post } from '../requests';

/**
 * getOpinionsFiledByJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.endDate the report end date
 * @param {object} providers.judgeName the judgeName to query for
 * @param {object} providers.startDate the report start date
 * @returns {Promise<*>} the promise of the api call
 */
export const getOpinionsFiledByJudgeInteractor = (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { startDate: string; endDate: string; judgeName: string },
) => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeName,
      startDate,
    },
    endpoint: '/judge-activity-report/opinions',
  });
};
