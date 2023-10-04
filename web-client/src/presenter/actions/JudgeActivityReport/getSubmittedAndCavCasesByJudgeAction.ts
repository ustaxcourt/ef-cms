import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { judges } = get(state.judgeActivityReport.filters);

  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { cases, totalCount } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    cases,
    totalCountForSubmittedAndCavCases: totalCount,
  };
};
