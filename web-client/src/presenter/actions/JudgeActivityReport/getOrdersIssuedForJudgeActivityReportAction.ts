import { state } from '@web-client/presenter/app.cerebral';

/**
 * Fetches the orders within a date range for the judge activity report
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context object
 * @returns {object} contains the orders returned from the use case
 */
export const getOrdersIssuedForJudgeActivityReportAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judges, startDate } = get(state.judgeActivityReport.filters);
  const clientConnectionId = get(state.clientConnectionId);

  const orders = await applicationContext
    .getUseCases()
    .getOrdersFiledByJudgeInteractor(applicationContext, {
      clientConnectionId,
      endDate,
      judges,
      startDate,
    });

  return { orders };
};
