import { state } from 'cerebral';

export const messageModalHelper = (get, applicationContext) => {
  const { CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT } =
    applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { correspondence, draftDocuments, formattedDocketEntries } =
    applicationContext
      .getUtilities()
      .getFormattedCaseDetail({ applicationContext, caseDetail });

  const form = get(state.modal.form);
  const screenMetadata = get(state.screenMetadata);

  const attachments = get(state.modal.form.attachments) || [];

  const currentAttachmentCount = attachments.length;
  const canAddDocument =
    currentAttachmentCount < CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT;
  const shouldShowAddDocumentForm =
    currentAttachmentCount === 0 || screenMetadata.showAddDocumentForm;

  const documents = [];
  formattedDocketEntries.forEach(entry => {
    if (entry.isFileAttached && entry.isOnDocketRecord) {
      entry.title = entry.descriptionDisplay || entry.documentType;
      documents.push(entry);
    }
  });
  draftDocuments.forEach(entry => {
    entry.title = entry.documentTitle || entry.documentType;
  });

  const showMessageAttachments =
    form.attachments && form.attachments.length > 0;

  return {
    correspondence,
    documents,
    draftDocuments,
    hasCorrespondence: correspondence && correspondence.length > 0,
    hasDocuments: documents.length > 0,
    hasDraftDocuments: draftDocuments.length > 0,
    showAddDocumentForm: canAddDocument && shouldShowAddDocumentForm,
    showAddMoreDocumentsButton: canAddDocument && !shouldShowAddDocumentForm,
    showMessageAttachments,
  };
};
