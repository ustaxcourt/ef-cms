import { CAV_AND_SUBMITTED_CASE_STATUS } from '@shared/business/entities/EntityConstants';
import { GetCasesByStatusAndByJudgeResponse } from '@web-api/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForCurrentJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  cases: GetCasesByStatusAndByJudgeResponse[];
}> => {
  const { userId } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCaseWorksheetsByJudgeInteractor(applicationContext, {
      judgeIds: [userId],
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
  };
};
