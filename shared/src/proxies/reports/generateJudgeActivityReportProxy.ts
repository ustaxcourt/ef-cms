const { post } = require('../requests');

/**
 * generateJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the end date for the report query
 * @param {string} providers.startDate the start date for the report query
 * @returns {Promise<*>} the promise of the api call
 */
export const generateJudgeActivityReportInteractor = (
  applicationContext,
  { endDate, startDate }: { startDate: string; endDate: string },
) => {
  return post({
    applicationContext,
    body: {
      endDate,
      startDate,
    },
    endpoint: '/reports/judge-activity-report',
  });
};
