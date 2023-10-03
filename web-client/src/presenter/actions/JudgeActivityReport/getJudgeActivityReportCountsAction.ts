import { state } from '@web-client/presenter/app.cerebral';

export const getJudgeActivityReportCountsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  return await applicationContext
    .getUseCases()
    .getCountOfCaseDocumentsFiledByJudgesInteractor(applicationContext, {
      endDate,
      judges,
      startDate,
    });
};
