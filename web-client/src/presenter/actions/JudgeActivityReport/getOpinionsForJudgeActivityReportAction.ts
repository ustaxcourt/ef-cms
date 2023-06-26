import { state } from '@web-client/presenter/app.cerebral';

export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(
    state.judgeActivityReport.filters,
  );
  const opinions = await applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
    });

  return { opinions };
};
