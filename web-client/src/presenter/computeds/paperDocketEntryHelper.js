import { state } from 'cerebral';

export const paperDocketEntryHelper = get => {
  const docketEntryId = get(state.docketEntryId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);
  const caseDetail = get(state.caseDetail);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);

  const allCaseDocuments = [
    ...(caseDetail.docketEntries || []),
    ...(caseDetail.correspondence || []),
  ];
  const document = allCaseDocuments.find(
    item => item.docketEntryId === docketEntryId,
  );

  const docketEntryHasDocument =
    document && document.isFileAttached && documentUploadMode === 'preview';

  return {
    docketEntryHasDocument,
    isEditingDocketEntry,
    showAddDocumentWarning: isEditingDocketEntry && !docketEntryHasDocument,
  };
};
