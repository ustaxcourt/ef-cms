const { post } = require('../requests');

/**
 * getTrialSessionsForJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Promise<*>} the promise of the api call
 */
exports.getTrialSessionsForJudgeActivityReportInteractor = (
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
    endpoint:
      '/judge-activity-report/trial-sessions?fields=trialLocation,trialSessionId,sessionStatus,startDate',
  });
};
