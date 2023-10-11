import { CAV_AND_SUBMITTED_CASES_PAGE_SIZE } from '../../../../../shared/src/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  selectedPage: number;
}>) => {
  const { judges } = get(state.judgeActivityReport.filters);
  const pageNumber = props.selectedPage;

  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { cases, totalCount } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges,
      pageNumber,
      pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    cases,
    totalCountForSubmittedAndCavCases: totalCount,
  };
};
