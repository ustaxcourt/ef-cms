import { post } from '../requests';

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
