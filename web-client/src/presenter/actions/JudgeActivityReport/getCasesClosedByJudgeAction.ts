import { state } from 'cerebral';

/**
 * Retrieves the cases closed by a judge in a date range
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} closed cases
 */
export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .getCasesClosedByJudgeInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
    });

  return { casesClosedByJudge };
};
