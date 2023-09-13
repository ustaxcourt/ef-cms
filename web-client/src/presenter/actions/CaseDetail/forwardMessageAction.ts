import { state } from '@web-client/presenter/app.cerebral';

export const forwardMessageAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const { attachments, parentMessageId } = await applicationContext
    .getUseCases()
    .forwardMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
      attachments: [...form.attachments, ...form.draftAttachments],
    });

  let messageViewerDocumentToDisplay;
  if (attachments) {
    messageViewerDocumentToDisplay = {
      documentId: attachments[attachments.length - 1].documentId,
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
