import { state } from 'cerebral';

/**
 * forwards the case message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the alert success message
 */
export const forwardCaseMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const { caseId } = get(state.caseDetail);

  const {
    parentMessageId,
  } = await applicationContext.getUseCases().forwardCaseMessageInteractor({
    applicationContext,
    caseId,
    ...form,
  });

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    parentMessageId,
  };
};
