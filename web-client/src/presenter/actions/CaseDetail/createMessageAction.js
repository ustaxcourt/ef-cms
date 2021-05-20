import { state } from 'cerebral';

export const createMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  await applicationContext
    .getUseCases()
    .createMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
    });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
  };
};
