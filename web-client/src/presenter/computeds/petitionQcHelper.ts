import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

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
    documentType: 'attachmentToPetitionFile',
    title: 'ATP',
  },
  {
    documentType: 'requestForPlaceOfTrialFile',
    title: 'RQT',
  },
  {
    documentType: 'corporateDisclosureFile',
    title: 'CDS',
  },
  {
    documentType: 'applicationForWaiverOfFilingFeeFile',
    title: 'APW',
  },
] as const;

export const petitionQcHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { isPaper } = get(state.form);
  const documents = get(state.caseDetail.docketEntries);

  const hasCDS = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
  );

  let documentTabsToDisplay = [...initialFilingDocumentTabs];

  const documentTypeMap = {
    applicationForWaiverOfFilingFeeFile:
      INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
    attachmentToPetitionFile:
      INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
    corporateDisclosureFile:
      INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
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
      if (tab.title === 'CDS') {
        // Do not display CDS tab if one wasn't filed electronically
        return hasCDS;
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
