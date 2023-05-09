import { state } from 'cerebral';

/**
 * Retrieves the cases closed by a judge in a date range
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} closed cases
 */
export const getCavAndSubmittedCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { endDate, judgeName, startDate } = get(state.form);

  const submittedAndCavCasesByJudge = await applicationContext
    .getUseCases()
    .getSubmittedAndCavCasesByJudgeInteractor(applicationContext, {
      endDate,
      judgeName,
      startDate,
      statuses: ['Submitted', 'CAV'],
    });

  return { submittedAndCavCasesByJudge };
};
