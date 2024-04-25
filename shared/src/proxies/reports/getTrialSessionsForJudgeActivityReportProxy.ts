import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityStatisticsRequest } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionTypes } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext: ClientApplicationContext,
  { endDate, judges, startDate }: JudgeActivityStatisticsRequest,
): Promise<TrialSessionTypes> =>
  post({
    applicationContext,
    body: {
      endDate,
      judges,
      startDate,
    },
    endpoint: '/judge-activity-report/trial-sessions',
  });
