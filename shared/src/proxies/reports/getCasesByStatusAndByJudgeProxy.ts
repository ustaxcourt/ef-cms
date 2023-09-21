import { JudgeActivityReportCavAndSubmittedCasesRequest } from '@shared/business/useCases/judgeActivityReport/getCasesByStatusAndByJudgeInteractor';
import { post } from '../requests';

/**
 * getCasesByStatusAndByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judgeName the judge name for the report query
 * @param {string} providers.statuses case statuses array for the report query
 * @returns {Promise<*>} the promise of the api call
 */
export const getCasesByStatusAndByJudgeInteractor = (
  applicationContext,
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
