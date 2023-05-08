import { state } from 'cerebral';

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
  const { endDate, judgeName, startDate } = get(state.form);

  const orders = await applicationContext
    .getUseCases()
    .getOrdersFiledByJudgeInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
    });

  return { orders };
};
