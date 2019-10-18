import { state } from 'cerebral';

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
