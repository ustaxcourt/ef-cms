import { state } from 'cerebral';

/**
 * Retrieves the cases closed by a judge in a date range
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} closed cases
 */
export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { judgeName } = get(state.form);

  const submittedAndCavCasesByJudge = await applicationContext
    .getUseCases()
    .getSubmittedAndCavCasesByJudgeInteractor(applicationContext, {
      judgeName,
      statuses: ['Submitted', 'CAV'],
    });

  return { submittedAndCavCasesByJudge };
};
