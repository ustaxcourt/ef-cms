import { state } from 'cerebral';

/**
 * forwards the message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the alert success message
 */
export const forwardMessageAction = async ({ applicationContext, get }) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const { parentMessageId } = await applicationContext
    .getUseCases()
    .forwardMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
    });

  let messageViewerDocumentToDisplay;
  if (form.attachments.length) {
    messageViewerDocumentToDisplay = {
      documentId: form.attachments[0].documentId,
    };
  }

  return {
    alertSuccess: {
      message: 'Your message has been sent.',
    },
    messageViewerDocumentToDisplay,
    parentMessageId,
  };
};
