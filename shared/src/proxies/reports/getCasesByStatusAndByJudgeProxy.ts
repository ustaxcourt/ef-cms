import { ClientApplicationContext } from '@web-client/applicationContext';
import {
  GetCasesByStatusAndByJudgeResponse,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { post } from '../requests';

export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/open-cases', // todo
  });
};
