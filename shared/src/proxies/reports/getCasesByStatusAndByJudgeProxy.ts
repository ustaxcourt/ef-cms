import { ClientApplicationContext } from '@web-client/applicationContext';
import { JudgeActivityReportCavAndSubmittedCasesRequest } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { post } from '../requests';

export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext: ClientApplicationContext,
  params: JudgeActivityReportCavAndSubmittedCasesRequest,
): Promise<{
  cases: (RawCase & {
    daysElapsedSinceLastStatusChange: number;
    formattedCaseCount: number;
  })[];
  totalCount: number;
}> => {
  return post({
    applicationContext,
    body: params,
    endpoint: '/judge-activity-report/open-cases',
  });
};
