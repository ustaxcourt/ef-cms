import { state } from 'cerebral';

export const initialFilingDocumentTabs = [
  {
    documentType: 'petitionFile',
    title: 'Petition',
  },
  {
    documentType: 'stinFile',
    title: 'STIN',
  },
  {
    documentType: 'requestForPlaceOfTrialFile',
    title: 'RQT',
  },
  {
    documentType: 'ownershipDisclosureFile',
    title: 'ODS',
  },
  {
    documentType: 'applicationForWaiverOfFilingFeeFile',
    title: 'APW',
  },
];

export const petitionQcHelper = (get, applicationContext) => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { isPaper } = get(state.form);
  const documents = get(state.caseDetail.docketEntries);

  const hasODS = !!documents.find(
    document =>
      document.eventCode ===
      INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  );

  let documentTabsToDisplay = [...initialFilingDocumentTabs];

  const documentTypeMap = {
    applicationForWaiverOfFilingFeeFile:
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
    ownershipDisclosureFile:
      INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
    petitionFile: INITIAL_DOCUMENT_TYPES.petition.documentType,
    requestForPlaceOfTrialFile:
      INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
    stinFile: INITIAL_DOCUMENT_TYPES.stin.documentType,
  };
  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const documentTypeSelectedForPreview =
    documentTypeMap[documentSelectedForPreview];

  const isPetitionFile =
    documentTypeSelectedForPreview === documentTypeMap.petitionFile;

  if (!isPaper) {
    documentTabsToDisplay = documentTabsToDisplay.filter(tab => {
      if (tab.title === 'ODS') {
        // Do not display ODS tab if one wasn't filed electronically
        return hasODS;
      } else {
        // Do not display APW and RQT tabs for electronic filing
        return tab.title !== 'APW' && tab.title !== 'RQT';
      }
    });
  }

  return {
    documentTabsToDisplay,
    isPetitionFile,
    showRemovePdfButton: isPaper,
  };
};
