import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { TrialSessionTypes } from '@shared/business/useCases/judgeActivityReport/getTrialSessionsForJudgeActivityReportInteractor';
import { post } from '../requests';

export const getTrialSessionsForJudgeActivityReportInteractor = (
  applicationContext: ClientApplicationContext,
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
