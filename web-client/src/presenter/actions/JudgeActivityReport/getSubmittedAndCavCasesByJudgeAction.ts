import { state } from 'cerebral';

/**
 * Retrieves the cases with a status of CAV or Submitted by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} an array of case entities
 */
export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { judgeName } = get(state.form);

  const submittedAndCavCasesByJudge = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judgeName,
      statuses: ['Submitted', 'CAV'],
    });

  return { submittedAndCavCasesByJudge };
};
