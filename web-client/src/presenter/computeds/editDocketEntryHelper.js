import { state } from 'cerebral';

export const editDocketEntryHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const { CONTACT_CHANGE_DOCUMENT_TYPES } = applicationContext.getConstants();

  const currentDocument = caseDetail.docketEntries.find(
    document => document.documentId === documentId,
  );

  let showPaperServiceWarning = false;

  if (CONTACT_CHANGE_DOCUMENT_TYPES.includes(currentDocument.documentType)) {
    const qcWorkItem = currentDocument.workItem;
    const qcWorkItemsUntouched =
      qcWorkItem && !qcWorkItem.isRead && !qcWorkItem.completedAt;

    if (qcWorkItemsUntouched) {
      showPaperServiceWarning = true;
    }
  }

  const formattedDocketEntry = applicationContext
    .getUtilities()
    .formatDocketEntry(applicationContext, currentDocument);

  return { formattedDocketEntry, showPaperServiceWarning };
};
