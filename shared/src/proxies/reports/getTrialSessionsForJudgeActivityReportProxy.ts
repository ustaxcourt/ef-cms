import { post } from '../requests';

/**
 * getTrialSessionsForJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.endDate the report end date
 * @param {object} providers.judgeId the judgeId to query for
 * @param {object} providers.startDate the report start date
 * @returns {Promise<*>} the promise of the api call
 */
export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext,
  {
    endDate,
    judgeId,
    startDate,
  }: { startDate: string; endDate: string; judgeId: string },
) => {
  return post({
    applicationContext,
    body: {
      endDate,
      judgeId,
      startDate,
    },
    endpoint: '/judge-activity-report/trial-sessions',
  });
};
