import { state } from '@web-client/presenter/app.cerebral';

export const forwardMessageAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const { parentMessageId } = await applicationContext
    .getUseCases()
    .forwardMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
      attachments: [...form.attachments, ...form.draftAttachments],
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
