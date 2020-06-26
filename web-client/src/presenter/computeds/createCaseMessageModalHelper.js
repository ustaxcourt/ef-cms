import { state } from 'cerebral';

export const createCaseMessageModalHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const {
    docketRecordWithDocument,
    draftDocuments,
  } = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({ applicationContext, caseDetail });

  const form = get(state.modal.form);
  const screenMetadata = get(state.screenMetadata);
  const documentAttachmentLimit = 5; // TODO: Do something better with this

  const currentAttachmentCount = (form.attachments || []).length;
  const canAddDocument = currentAttachmentCount < documentAttachmentLimit;
  const shouldShowAddDocumentForm =
    currentAttachmentCount === 0 || screenMetadata.showAddDocumentForm;

  const documents = [];
  docketRecordWithDocument.forEach(entry => {
    if (entry.document) {
      documents.push(entry.document);
    }
  });

  return {
    documents,
    draftDocuments,
    showAddDocumentForm: canAddDocument && shouldShowAddDocumentForm,
    showAddMoreDocumentsButton: canAddDocument && !shouldShowAddDocumentForm,
  };
};
