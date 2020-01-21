import { state } from 'cerebral';

export const editDocketEntryHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const { CONTACT_CHANGE_DOCUMENT_TYPES } = applicationContext.getConstants();

  const currentDocument = caseDetail.documents.find(
    document => document.documentId === documentId,
  );

  let showPaperServiceWarning = false;

  if (CONTACT_CHANGE_DOCUMENT_TYPES.includes(currentDocument.documentType)) {
    const qcWorkItems = (currentDocument.workItems || []).filter(wi => wi.isQC);
    const qcWorkItemsUntouched =
      !!qcWorkItems.length &&
      qcWorkItems.reduce((acc, wi) => {
        return acc && !wi.isRead && !wi.completedAt;
      }, true);

    if (qcWorkItemsUntouched) {
      showPaperServiceWarning = true;
    }
  }

  return { showPaperServiceWarning };
};
