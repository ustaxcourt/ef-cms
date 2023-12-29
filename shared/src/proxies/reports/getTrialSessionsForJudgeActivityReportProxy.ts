import { ClientApplicationContext } from '@web-client/applicationContext';
import { TrialSessionTypes } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { getStatisticsRequest } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext: ClientApplicationContext,
  { endDate, judges, startDate }: getStatisticsRequest,
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
