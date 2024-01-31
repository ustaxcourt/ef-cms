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
  const { INITIAL_DOCUMENT_TYPES, INITIAL_DOCUMENT_TYPES_FILE_MAP } =
    applicationContext.getConstants();
  const { isPaper } = get(state.form);
  const documents = get(state.caseDetail.docketEntries);
  const ATP_EVENT_CODE = INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode;

  const hasCDS = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
  );

  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const isPetitionFile =
    documentSelectedForPreview === INITIAL_DOCUMENT_TYPES_FILE_MAP.petition;

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
