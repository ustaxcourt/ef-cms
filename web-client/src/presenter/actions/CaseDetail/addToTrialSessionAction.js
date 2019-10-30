import { state } from 'cerebral';

/**
 * calls the addCaseToTrialSessionInteractor to add the case to the trial session
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the alertSuccess and updated caseDetail object
 */
export const addToTrialSessionAction = async ({ applicationContext, get }) => {
  const { caseId } = get(state.caseDetail);
  const { trialSessionId } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .addCaseToTrialSessionInteractor({
      applicationContext,
      caseId,
      trialSessionId,
    });

  return {
    alertSuccess: {
      message: 'Trial details are visible under Trial Information.',
      title: 'This case has been set for trial',
    },
    caseDetail,
  };
};
