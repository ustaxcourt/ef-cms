import { state } from 'cerebral';

/**
 * calls the blockCaseFromTrialInteractor to add the block the case from being set for trial
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const blockCaseFromTrialAction = async ({ applicationContext, get }) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const reason = get(state.modal.reason);

  const caseDetail = await applicationContext
    .getUseCases()
    .blockCaseFromTrialInteractor(applicationContext, {
      docketNumber,
      reason,
    });

  return {
    alertSuccess: {
      message: 'Case blocked from being set for trial.',
    },
    caseDetail,
  };
};
