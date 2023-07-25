import { CAV_AND_SUBMITTED_CASES_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * Retrieves the cases with a status of CAV or Submitted by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} an array of case entities and a map containing consolidated cases group counts
 */
export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { judges } = get(state.judgeActivityReport.filters);
  const pageNumber = props.selectedPage;

  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { cases, consolidatedCasesGroupCountMap, totalCount } =
    await applicationContext
      .getUseCases()
      .getCasesByStatusAndByJudgeInteractor(applicationContext, {
        judges,
        pageNumber,
        pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
        statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
      });

  return {
    cases,
    consolidatedCasesGroupCountMap,
    totalCountForSubmittedAndCavCases: totalCount,
  };
};
