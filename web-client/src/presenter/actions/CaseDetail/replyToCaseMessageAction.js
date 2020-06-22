import { state } from 'cerebral';

export const replyToCaseMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const { caseId } = get(state.caseDetail);

  const {
    docketNumber,
    parentMessageId,
  } = await applicationContext.getUseCases().replyToCaseMessageInteractor({
    applicationContext,
    caseId,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    docketNumber,
    parentMessageId,
  };
};
