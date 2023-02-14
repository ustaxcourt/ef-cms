import { state } from 'cerebral';

export const docketEntryQcHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const { CONTACT_CHANGE_DOCUMENT_TYPES } = applicationContext.getConstants();

  const currentDocument = caseDetail.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === docketEntryId,
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
