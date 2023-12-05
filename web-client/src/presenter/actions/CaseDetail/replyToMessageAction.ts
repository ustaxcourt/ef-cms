import { state } from '@web-client/presenter/app.cerebral';

export const replyToMessageAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const form = get(state.modal.form);

  const docketNumber = get(state.caseDetail.docketNumber);

  const computedAttachments = [...form.attachments, ...form.draftAttachments];

  const { parentMessageId } = await applicationContext
    .getUseCases()
    .replyToMessageInteractor(applicationContext, {
      docketNumber,
      ...form,
      attachments: computedAttachments,
    });

  let messageViewerDocumentToDisplay;
  if (computedAttachments.length) {
    messageViewerDocumentToDisplay = {
      documentId: computedAttachments[0].documentId,
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
