import { state } from '@web-client/presenter/app.cerebral';

export const getOpinionsForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const opinions = await applicationContext
    .getUseCases()
    .getCountOfOpinionsFiledByJudgesInteractor(applicationContext, {
      endDate,
      judges,
      startDate,
    });

  return { opinions };
};
