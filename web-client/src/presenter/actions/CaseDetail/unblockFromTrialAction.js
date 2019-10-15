import { state } from 'cerebral';

export const unblockFromTrialAction = async ({ applicationContext, get }) => {
  const { caseId } = get(state.caseDetail);

  const caseDetail = await applicationContext
    .getUseCases()
    .unblockFromTrialInteractor({
      applicationContext,
      caseId,
    });

  return {
    alertSuccess: {
      message:
        'This case will be eligible to be set for the next available trial session.',
      title: 'The block on this case has been removed',
    },
    caseDetail,
  };
};
