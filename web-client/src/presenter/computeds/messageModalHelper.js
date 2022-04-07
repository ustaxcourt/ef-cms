import { state } from 'cerebral';

export const messageModalHelper = (get, applicationContext) => {
  const { CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT } =
    applicationContext.getConstants();

  const caseDetail = get(state.caseDetail);
  const screenMetadata = get(state.screenMetadata);
  const { attachments } = get(state.modal.form);

  const { correspondence, draftDocuments, formattedDocketEntries } =
    applicationContext
      .getUtilities()
      .getFormattedCaseDetail({ applicationContext, caseDetail });

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

  const currentAttachmentCount = attachments.length;
  const canAddDocument =
    currentAttachmentCount < CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT;
  const shouldShowAddDocumentForm =
    currentAttachmentCount === 0 || screenMetadata.showAddDocumentForm;

  return {
    correspondence,
    documents,
    draftDocuments,
    hasCorrespondence: correspondence && correspondence.length > 0,
    hasDocuments: documents.length > 0,
    hasDraftDocuments: draftDocuments.length > 0,
    showAddDocumentForm: canAddDocument && shouldShowAddDocumentForm,
    showAddMoreDocumentsButton: canAddDocument && !shouldShowAddDocumentForm,
    showMessageAttachments: attachments.length > 0,
  };
};
