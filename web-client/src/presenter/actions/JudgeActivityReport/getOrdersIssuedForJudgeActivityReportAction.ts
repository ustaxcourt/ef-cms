import { state } from '@web-client/presenter/app.cerebral';

export const getOrdersIssuedForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const orders = await applicationContext
    .getUseCases()
    .getOrdersFiledByJudgeInteractor(applicationContext, {
      endDate,
      judges,
      startDate,
    });

  return { orders };
};
