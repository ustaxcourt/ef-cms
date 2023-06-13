import { state } from 'cerebral';

export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const { currentJudgesNames } = props;

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .getCasesClosedByJudgeInteractor(applicationContext, {
      currentJudgesNames,
      endDate,
      judgeName,
      startDate,
    });

  return { casesClosedByJudge };
};
