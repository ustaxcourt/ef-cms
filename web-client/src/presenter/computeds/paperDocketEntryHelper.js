import { state } from 'cerebral';

export const paperDocketEntryHelper = (get, applicationContext) => {
  const docketEntryId = get(state.docketEntryId);
  const isEditingDocketEntry = get(state.isEditingDocketEntry);
  const caseDetail = get(state.caseDetail);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);
  const isPetitionServed = applicationContext
    .getUtilities()
    .caseHasServedPetition(caseDetail);

  const allCaseDocuments = [
    ...(caseDetail.docketEntries || []),
    ...(caseDetail.correspondence || []),
  ];
  const doc = allCaseDocuments.find(
    item => item.docketEntryId === docketEntryId,
  );

  const docketEntryHasDocument =
    doc && doc.isFileAttached && documentUploadMode === 'preview';

  const showServiceWarning = !isPetitionServed;
  const showSaveAndServeButton = isPetitionServed;

  return {
    docketEntryHasDocument,
    isEditingDocketEntry,
    showAddDocumentWarning: isEditingDocketEntry && !docketEntryHasDocument,
    showSaveAndServeButton,
    showServiceWarning,
  };
};
