import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionReturnType } from '@web-api/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext: ClientApplicationContext,
  { endDate, judges, startDate }: JudgeActivityStatisticsRequest,
): Promise<TrialSessionReturnType> =>
  post({
    applicationContext,
    body: {
      endDate,
      judges,
      startDate,
    },
    endpoint: '/judge-activity-report/trial-sessions',
  });
