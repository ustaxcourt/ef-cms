import { state } from 'cerebral';

/**
 * Retrieves the judge's activity for the provided dates
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} the judge activity report
 */
export const getCasesClosedByJudgeAction = async ({
  applicationContext,
  get,
}) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const casesClosedByJudge = await applicationContext
    .getUseCases()
    .generateJudgeActivityReportInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
    });

  return { casesClosedByJudge };
};
