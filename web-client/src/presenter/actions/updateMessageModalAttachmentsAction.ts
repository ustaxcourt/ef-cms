import { state } from '@web-client/presenter/app.cerebral';

export const updateMessageModalAttachmentsAction = ({
  applicationContext,
  get,
  props,
  store,
}: ActionProps) => {
  console.log('updateMessageModalAttachmentsAction called', props);
  const { attachments, draftAttachments, subject } = get(state.modal.form);
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
    
    console.log(`Subject state: ${subject}`);
    // TODO: Alter this logic for 10693
    if (attachments.length + draftAttachments.length === 0) {
      // TODO 10693: Bug here. If the subject is removed, it will not be updated.
      // This is the first attachment, so we should update the subject
      // We are updating the subject line
      console.log(`Updating subject to: ${documentTitle.slice(0, 250)}`);
      store.set(state.modal.form.subject, documentTitle.slice(0, 250));
      
    }
    console.log(`Document title: ${documentTitle}`);
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
