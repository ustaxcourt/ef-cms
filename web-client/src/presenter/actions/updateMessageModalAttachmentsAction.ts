import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { draftAttachments } = get(state.modal.form);
  const caseDetail = get(state.caseDetail);
  const documentId = props.documentId || get(state.docketEntryId);
  const showModal = get(state.modal.showModal);

  if (documentId) {
    const document = applicationContext
      .getUtilities()
      .getAttachmentDocumentById({
        caseDetail,
        documentId,
      });

    const documentTitle = applicationContext
      .getUtilities()
      .getDescriptionDisplay(document);

    if (props.action === 'add') {
      draftAttachments.push({
        documentId,
        documentTitle,
        index: document.index,
      });
      if (showModal === 'CreateMessageModal') {
        store.set(state.modal.form.subject, documentTitle.slice(0, 250));
      }
    } else if (props.action === 'remove') {
      const foundIndex = draftAttachments.findIndex(
        attachment => attachment.documentId == props.documentId,
      );
      draftAttachments.splice(foundIndex, 1);

      if (showModal === 'CreateMessageModal') {
        if (draftAttachments.length === 0) {
          store.unset(state.modal.form.subject);
        } else {
          const latestAttachment =
            draftAttachments[draftAttachments.length - 1];
          store.set(
            state.modal.form.subject,
            latestAttachment.documentTitle.slice(0, 250),
          );
        }
      }
    }

    store.set(state.modal.form.draftAttachments, draftAttachments);
  }
};
