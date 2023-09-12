import { state } from '@web-client/presenter/app.cerebral';

export const getJudgeActivityReportCountsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);

  const response = await applicationContext
    .getUseCases()
    .getCountOfCaseDocumentsFiledByJudgesInteractor(applicationContext, {
      endDate,
      judges,
      startDate,
    });

  return {
    opinions: {
      aggregations: response.opinionAggregations,
      total: response.opinionTotal,
    },
    orders: {
      aggregations: response.orderAggregations,
      total: response.orderTotal,
    },
  };
};
