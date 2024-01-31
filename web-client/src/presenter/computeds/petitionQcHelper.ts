import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

type FilingDocumentsType = {
  documentType: string;
  title: string;
  documentId?: string;
  eventCode?: string;
}[];

// todo: move population of eventCodes in these tabs into helper
export const initialFilingDocumentTabs = [
  {
    documentType: 'petitionFile',
    eventCode: 'P',
    title: 'Petition',
  },
  {
    documentType: 'stinFile',
    eventCode: 'STIN',
    title: 'STIN',
  },
  {
    documentType: 'attachmentToPetitionFile',
    eventCode: 'ATP',
    title: 'ATP',
  },
  {
    documentType: 'requestForPlaceOfTrialFile',
    eventCode: 'RQT',
    title: 'RQT',
  },
  {
    documentType: 'corporateDisclosureFile',
    eventCode: 'CDS',
    title: 'CDS',
  },
  {
    documentType: 'applicationForWaiverOfFilingFeeFile',
    eventCode: 'APW',
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
  const ATP_EVENT_CODE = INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode;

  const hasCDS = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
  );

  let documentTabsToDisplay = initialFilingDocumentTabs.map(
    docToDisplayMetaData => {
      return {
        ...docToDisplayMetaData,
        documentId: documents.find(
          doc => doc.eventCode === docToDisplayMetaData.eventCode,
        )?.docketEntryId,
      };
    },
  );

  const atpDocketTabsForDisplay = documents
    .filter(doc => doc.eventCode === ATP_EVENT_CODE)
    .map(doc => {
      return {
        documentId: doc.docketEntryId,
        documentType: 'attachmentToPetitionFile',
        eventCode: doc.eventCode,
        title: ATP_EVENT_CODE,
      };
    });

  if (atpDocketTabsForDisplay.length) {
    const firstTwoTabs = documentTabsToDisplay.slice(0, 2);
    const remainingTabs = documentTabsToDisplay.slice(3);
    documentTabsToDisplay = [
      ...firstTwoTabs,
      ...atpDocketTabsForDisplay,
      ...remainingTabs,
    ];
  }

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
