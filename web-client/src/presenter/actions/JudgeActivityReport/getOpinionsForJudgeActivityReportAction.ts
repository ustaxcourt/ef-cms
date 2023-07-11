import { state } from '@web-client/presenter/app.cerebral';

export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);
  const clientConnectionId = get(state.clientConnectionId);

  const opinions = await applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor(applicationContext, {
      clientConnectionId,
      endDate,
      judges,
      startDate,
    });

  store.set(
    state.judgeActivityReport.judgeActivityReportData.opinions,
    opinions,
  );
};
