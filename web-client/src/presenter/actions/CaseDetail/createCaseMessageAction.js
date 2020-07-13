import { state } from 'cerebral';

export const createCaseMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const { caseId } = get(state.caseDetail);

  await applicationContext.getUseCases().createCaseMessageInteractor({
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
