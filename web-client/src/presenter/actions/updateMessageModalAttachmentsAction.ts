import { state } from '@web-client/presenter/app.cerebral';
import { MAX_MESSAGE_SUBJECT_CHARACTERS } from '@shared/business/entities/EntityConstants';
type DraftMessageAttachment = { documentId: string; documentTitle: string; index: string };

export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  const { attachments, draftAttachments, subject }: {
    attachments?: unknown[];
    draftAttachments?: DraftMessageAttachment[];
    subject?: string;
  } = get(state.modal.form);
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

    // Extract attachment calculations for better readability
    const attachmentCount = attachments?.length || 0;
    const draftAttachmentCount = draftAttachments?.length || 0;
    const hasNoAttachments = attachmentCount + draftAttachmentCount === 0;

    if (isSubjectEmpty && hasNoAttachments) {
      store.set(
        state.modal.form.subject,
        documentTitle.slice(0, MAX_MESSAGE_SUBJECT_CHARACTERS),
      );
    }
    if (props.action === 'add' && draftAttachments) {
      draftAttachments.push({
        documentId,
        documentTitle,
        index: document.index,
      });

      if (
        showModal === 'CreateMessageModal' &&
        !get(state.modal.form.subject)
      ) {
        store.set(
          state.modal.form.subject,
          documentTitle.slice(0, MAX_MESSAGE_SUBJECT_CHARACTERS),
        );
      }
    } else if (props.action === 'remove' && draftAttachments) {
      const foundIndex = draftAttachments.findIndex(
        attachment => attachment.documentId == props.documentId,
      );
      draftAttachments.splice(foundIndex, 1);
    }

    store.set(state.modal.form.draftAttachments, draftAttachments);
  }
};
