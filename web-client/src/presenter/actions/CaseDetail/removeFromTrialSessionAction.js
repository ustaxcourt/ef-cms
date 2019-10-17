import { state } from 'cerebral';

export const removeFromTrialSessionAction = async ({
  applicationContext,
  get,
}) => {
  const { caseId, trialSessionId } = get(state.caseDetail);
  const { disposition } = get(state.modal);

  const caseDetail = await applicationContext
    .getUseCases()
    .removeCaseFromTrialInteractor({
      applicationContext,
      caseId,
      disposition,
      trialSessionId,
    });

  return {
    alertSuccess: {
      message:
        'This case may be eligible for the next available trial session.',
      title: 'This case has been removed from this trial session',
    },
    caseDetail,
  };
};
