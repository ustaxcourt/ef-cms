import { state } from '@web-client/presenter/app.cerebral';

export const getOrdersIssuedForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgesSelection, startDate } = get(
    state.judgeActivityReport.filters,
  );

  const orders = await applicationContext
    .getUseCases()
    .getOrdersFiledByJudgeInteractor(applicationContext, {
      endDate,
      judgesSelection,
      startDate,
    });

  return { orders };
};
