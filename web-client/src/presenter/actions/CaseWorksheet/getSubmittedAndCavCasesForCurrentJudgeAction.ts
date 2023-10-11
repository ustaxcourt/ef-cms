import { GetCasesByStatusAndByJudgeResponse } from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { name } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCaseWorksheetsByJudgeInteractor(applicationContext, {
      judges: [name],
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    cases,
  };
};
