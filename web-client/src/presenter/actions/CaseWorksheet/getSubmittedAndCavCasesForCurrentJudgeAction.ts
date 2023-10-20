import { CAV_AND_SUBMITTED_CASE_STATUS } from '@shared/business/entities/EntityConstants';
import { GetCasesByStatusAndByJudgeResponse } from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  const { name } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCaseWorksheetsByJudgeInteractor(applicationContext, {
      judges: [name],
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
  };
};
