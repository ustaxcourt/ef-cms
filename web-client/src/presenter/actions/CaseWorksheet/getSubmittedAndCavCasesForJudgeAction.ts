import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { name } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges: [name],
      pageNumber: 0,
      // TODO: don't paginate for dashboard table?
      pageSize: 10000,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    cases,
  };
};
