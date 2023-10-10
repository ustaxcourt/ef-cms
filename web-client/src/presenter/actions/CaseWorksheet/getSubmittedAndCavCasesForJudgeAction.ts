import { CAV_AND_SUBMITTED_CASE_STATUS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getSubmittedAndCavCasesForJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps): Promise<{
  cases: (RawCase & {
    daysElapsedSinceLastStatusChange: number;
    formattedCaseCount: number;
  })[];
}> => {
  const { name } = get(state.judgeUser);

  const { cases } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judges: [name],
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });

  return {
    cases,
  };
};
