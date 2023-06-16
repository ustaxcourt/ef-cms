import { state } from '@web-client/presenter/app.cerebral';

export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );
  const opinions = await applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor(applicationContext, {
      endDate,
      judgesSelection,
      startDate,
    });

  return { opinions };
};
