import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const petitionQcHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const { INITIAL_DOCUMENT_TYPES, INITIAL_DOCUMENT_TYPES_FILE_MAP } =
    applicationContext.getConstants();
  const { isPaper } = get(state.form);
  const documents = get(state.caseDetail.docketEntries);

  const hasCDS = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.corporateDisclosure.eventCode,
  );

  const hasATP = !!documents.find(
    doc =>
      doc.eventCode === INITIAL_DOCUMENT_TYPES.attachmentToPetition.eventCode,
  );

  const documentSelectedForPreview = get(
    state.currentViewMetadata.documentSelectedForPreview,
  );

  const isPetitionFile =
    documentSelectedForPreview === INITIAL_DOCUMENT_TYPES_FILE_MAP.petition;

  let documentTabsToDisplay = Object.values(INITIAL_DOCUMENT_TYPES).map(
    docToDisplayMetaData => {
      return {
        ...docToDisplayMetaData,
        documentId: documents.find(
          doc => doc.eventCode === docToDisplayMetaData.eventCode,
        )?.docketEntryId,
      };
    },
  );

  documentTabsToDisplay.sort((a, b) => a.sort - b.sort);

  if (!isPaper) {
    documentTabsToDisplay = documentTabsToDisplay.filter(tab => {
      if (tab.tabTitle === 'ATP') {
        // Do not display ATP tab if it wasn't filed electronically
        return hasATP;
      }
      if (tab.tabTitle === 'CDS') {
        // Do not display ATP tab if it wasn't filed electronically
        return hasCDS;
      } else {
        // Do not display APW and RQT tabs for electronic filing
        return tab.tabTitle !== 'APW' && tab.tabTitle !== 'RQT';
      }
    });
  }
  return {
    documentTabsToDisplay,
    isPetitionFile,
    showRemovePdfButton: isPaper,
  };
};
