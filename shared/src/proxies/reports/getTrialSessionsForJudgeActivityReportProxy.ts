import { TrialSessionTypes } from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext,
  {
    endDate,
    judgesSelection,
    startDate,
  }: { startDate: string; endDate: string; judgesSelection: string[] },
): Promise<TrialSessionTypes> =>
  post({
    applicationContext,
    body: {
      endDate,
      judgesSelection,
      startDate,
    },
    endpoint: '/judge-activity-report/trial-sessions',
  });
