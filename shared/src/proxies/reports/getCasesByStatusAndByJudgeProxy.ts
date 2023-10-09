import {
  CavAndSubmittedFilteredCasesType,
  JudgeActivityReportCavAndSubmittedCasesRequest,
} from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { post } from '../requests';

export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: CavAndSubmittedFilteredCasesType[];
}> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/open-cases', // todo
  });
};
