import { state } from 'cerebral';

export const paperDocketEntryHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const docketEntryId = get(state.docketEntryId);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);

  const canAllowDocumentServiceForCase = applicationContext
    .getUtilities()
    .canAllowDocumentServiceForCase(caseDetail);

  const allCaseDocuments = [
    ...caseDetail.docketEntries,
    ...caseDetail.correspondence,
  ];

  const doc = allCaseDocuments.find(
    item => item.docketEntryId === docketEntryId,
  );
  const docketEntryHasDocument = !!(doc && doc.isFileAttached);
  const showAddDocumentWarning =
    isEditingDocketEntry &&
    !docketEntryHasDocument &&
    documentUploadMode === 'preview';

  return {
    showAddDocumentWarning,
    showSaveAndServeButton: canAllowDocumentServiceForCase,
    showServiceWarning: !canAllowDocumentServiceForCase,
  };
};
