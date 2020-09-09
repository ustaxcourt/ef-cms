import { state } from 'cerebral';

export const paperDocketEntryHelper = get => {
  const documentId = get(state.documentId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);
  const caseDetail = get(state.caseDetail);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);

  const allCaseDocuments = [
    ...(caseDetail.documents || []),
    ...(caseDetail.correspondence || []),
  ];
  const document = allCaseDocuments.find(
    item => item.documentId === documentId,
  );

  const docketEntryHasDocument =
    document && document.isFileAttached && documentUploadMode === 'preview';

  return {
    docketEntryHasDocument,
    isEditingDocketEntry,
    showAddDocumentWarning: isEditingDocketEntry && !docketEntryHasDocument,
  };
};
