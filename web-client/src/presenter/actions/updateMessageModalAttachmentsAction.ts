import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { attachments, draftAttachments, subject } = get(state.modal.form) as {
    attachments?: Array<unknown>;
    draftAttachments?: Array<{
      documentId: string;
      documentTitle: string;
      index: string;
    }>;
    subject?: string;
  };
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

    const isSubjectEmpty = !subject || subject.trim() === '';

    if (
      isSubjectEmpty &&
      attachments?.length + draftAttachments?.length === 0
    ) {
      store.set(state.modal.form.subject, documentTitle.slice(0, 250));
    }
    if (props.action === 'add') {
      draftAttachments.push({
        documentId,
        documentTitle,
        index: document.index,
      });

      if (
        showModal === 'CreateMessageModal' &&
        !get(state.modal.form.subject)
      ) {
        store.set(state.modal.form.subject, documentTitle.slice(0, 250));
      }
    } else if (props.action === 'remove') {
      const foundIndex = draftAttachments.findIndex(
        attachment => attachment.documentId == props.documentId,
      );
      draftAttachments.splice(foundIndex, 1);
    }

    store.set(state.modal.form.draftAttachments, draftAttachments);
  }
};
