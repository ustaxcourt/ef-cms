import { state } from 'cerebral';

export const forwardCaseMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const { caseId } = get(state.caseDetail);

  await applicationContext.getUseCases().forwardCaseMessageInteractor({
    applicationContext,
    caseId,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
  };
};
