import { state } from 'cerebral';

export const paperDocketEntryHelper = get => {
  const docketEntryHasDocument = get(state.documentId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);

  return {
    docketEntryHasDocument,
    isEditingDocketEntry,
    showAddDocumentAlert: isEditingDocketEntry && !docketEntryHasDocument,
  };
};
