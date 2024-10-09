import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionTypes } from '@web-api/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityStatisticsRequest,
): Promise<TrialSessionTypes> =>
  post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/trial-sessions',
  });
