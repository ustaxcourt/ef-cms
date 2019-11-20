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
  const { caseId } = get(state.caseDetail);
  const { reason } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .blockCaseFromTrialInteractor({
      applicationContext,
      caseId,
      reason,
    });

  return {
    alertSuccess: {
      message:
        'To set this case for trial, remove the block from the Trial Information section.',
      title: 'This case is now blocked from being set for trial',
    },
    caseDetail,
  };
};
