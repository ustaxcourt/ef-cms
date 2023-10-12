import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityReportFilters } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { post } from '../requests';

export const getCasesClosedByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityReportFilters,
): Promise<CasesClosedReturnType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/closed-cases',
  });
};
