import {
  CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
  CAV_AND_SUBMITTED_CASE_STATUS,
} from '../../../../../shared/src/business/entities/EntityConstants';
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

  const { cases, totalCount } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges,
      pageNumber,
      pageSize: CAV_AND_SUBMITTED_CASES_PAGE_SIZE,
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
    totalCountForSubmittedAndCavCases: totalCount,
  };
};
