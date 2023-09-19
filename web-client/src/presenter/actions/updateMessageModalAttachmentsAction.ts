import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { attachments, draftAttachments } = get(state.modal.form);
  const caseDetail = get(state.caseDetail);
  const documentId = props.documentId || get(state.docketEntryId);

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

    if (attachments.length + draftAttachments.length === 0) {
      // This is the first attachment, so we should update the subject
      store.set(state.modal.form.subject, documentTitle.slice(0, 250));
    }
    if (props.action === 'add') {
      draftAttachments.push({
        documentId,
        documentTitle,
      });
    } else if (props.action === 'remove') {
      const foundIndex = draftAttachments.findIndex(
        attachment => attachment.documentId == props.documentId,
      );
      draftAttachments.splice(foundIndex, 1);
    }

    store.set(state.modal.form.draftAttachments, draftAttachments);
  }
};
