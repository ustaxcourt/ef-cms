import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

type FilingDocumentsType = {
  documentType: string;
  title: string;
  documentId?: string;
}[];

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
] as FilingDocumentsType;

export const petitionQcHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { INITIAL_DOCUMENT_TYPES } = applicationContext.getConstants();
  const { isPaper } = get(state.form);
  const documents = get(state.caseDetail.docketEntries);

  console.log('documents', documents);

  const hasCDS = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
  );

  const computeATPDocketEntries = documents.filter(doc => {
    return doc.eventCode === 'ATP';
  });

  const computeATPTabsCount = computeATPDocketEntries.length;

  console.log('computeATPTabsCount', computeATPTabsCount);

  const atpTabInfo = {
    documentType: 'attachmentToPetitionFile',
    title: 'ATP',
  };

  // 1. Remove atpTabInfo first so we can re-add later with the document ids so it makes the request
  // to render the document with the id
  // is this the best work around?
  let documentTabsToDisplay: FilingDocumentsType = [
    ...initialFilingDocumentTabs,
  ]
    .filter(filingTab => {
      return filingTab !== atpTabInfo;
    })
    .map(filingTabInfo => {
      return {
        ...filingTabInfo,
        documentId: documents.find(
          doc => doc.documentType === filingTabInfo.documentType,
        ).docketEntryId,
      };
    });

  if (!computeATPTabsCount) {
    documentTabsToDisplay[2] = atpTabInfo;
  } else {
    const startIndex = 1;
    computeATPDocketEntries.forEach((atpTab, index) => {
      documentTabsToDisplay[index + startIndex] = atpTabInfo;
    });
  }

  console.log('initialFilingDocumentTabs', initialFilingDocumentTabs);

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

  console.log('documentSelectedForPreview', documentSelectedForPreview);

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
