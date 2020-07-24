import { state } from 'cerebral';

export const replyToCaseMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const {
    parentMessageId,
  } = await applicationContext.getUseCases().replyToCaseMessageInteractor({
    applicationContext,
    docketNumber,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    parentMessageId,
  };
};
