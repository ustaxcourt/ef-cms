import { state } from 'cerebral';

export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .getCasesClosedByJudgeInteractor(applicationContext, {
      endDate,
      judgesSelection,
      startDate,
    });

  return { casesClosedByJudge };
};
