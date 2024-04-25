import { CasesClosedReturnType } from '@shared/business/useCases/judgeActivityReport/getCasesClosedByJudgeInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityStatisticsRequest } from '@shared/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { post } from '../requests';

export const getCasesClosedByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityStatisticsRequest,
): Promise<CasesClosedReturnType> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/closed-cases',
  });
};
