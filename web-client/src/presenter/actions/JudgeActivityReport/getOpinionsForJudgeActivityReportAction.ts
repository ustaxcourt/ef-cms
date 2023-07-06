import { state } from '@web-client/presenter/app.cerebral';

export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);
  const clientConnectionId = get(state.clientConnectionId);

  await applicationContext
    .getUseCases()
    .getOpinionsFiledByJudgeInteractor(applicationContext, {
      clientConnectionId,
      endDate,
      judges,
      startDate,
    });
};
