import {
  JudgeActivityReportFilters,
  TrialSessionTypes,
} from '../../../../web-client/src/presenter/judgeActivityReportState';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext,
  { endDate, judgeId, startDate }: JudgeActivityReportFilters,
): Promise<TrialSessionTypes> =>
  post({
    applicationContext,
    body: {
      endDate,
      judgeId,
      startDate,
    },
    endpoint: '/judge-activity-report/trial-sessions',
  });
