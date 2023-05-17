import { state } from 'cerebral';

/**
 * Retrieves the cases with a status of CAV or Submitted by judge
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @returns {object} an array of case entities and a map containing consolidated cases group counts
 */
export const getSubmittedAndCavCasesByJudgeAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { judgeName } = get(state.form);
  const { CASE_STATUS_TYPES } = applicationContext.getConstants();

  const { cases, consolidatedCasesGroupCountMap } = await applicationContext
    .getUseCases()
    .getCasesByStatusAndByJudgeInteractor(applicationContext, {
      judgeName,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });

  return {
    consolidatedCasesGroupCountMap: new Map(
      Object.entries(consolidatedCasesGroupCountMap),
    ),
    submittedAndCavCasesByJudge: cases,
  };
};
