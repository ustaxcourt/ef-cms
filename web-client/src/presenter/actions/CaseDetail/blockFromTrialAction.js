import { state } from 'cerebral';

export const blockFromTrialAction = async ({ applicationContext, get }) => {
  const { caseId } = get(state.caseDetail);
  const { reason } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .blockFromTrialInteractor({
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
