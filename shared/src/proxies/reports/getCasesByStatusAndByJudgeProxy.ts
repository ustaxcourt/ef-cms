import { CavAndSubmittedCaseTypes } from 'shared/src/business/entities/EntityConstants';
import { consolidatedCasesGroupCountMapResponseType } from '../../../../web-client/src/presenter/judgeActivityReportState';
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
  {
    judgesSelection,
    statuses,
  }: {
    judgesSelection: string[];
    statuses: CavAndSubmittedCaseTypes;
  },
): Promise<{
  cases: RawCase;
  consolidatedCasesGroupCountMap: consolidatedCasesGroupCountMapResponseType;
}> => {
  return post({
    applicationContext,
    body: {
      judgesSelection,
      statuses,
    },
    endpoint: '/judge-activity-report/open-cases',
  });
};
