import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const docketRecordHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): {
  countOfDocumentsForDownload: number;
  showBatchDownloadControls: boolean;
  showEditOrSealDocketRecordEntry: boolean;
  showPrintableDocketRecord: boolean;
  sortLabelTextMobile: string;
} => {
  const permissions = get(state.permissions);
  const { docketRecordFilter, docketRecordSort } = get(state.sessionMetadata);
  const {
    canAllowPrintableDocketRecord: showPrintableDocketRecord,
    docketEntries,
    docketNumber,
  } = get(state.caseDetail);
  const docIdsSelectedForDownload = get(state.documentsSelectedForDownload);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabelsMobile = {
    byDate: 'Oldest to Newest',
    byDateDesc: 'Newest to Oldest',
  };

  const sortLabelTextMobile = sortLabelsMobile[sortOrder];

  const documentsIdsForDownload = applicationContext
    .getUtilities()
    .getCaseDocumentsIdsFilteredByDocumentType(applicationContext, {
      docIdsSelectedForDownload,
      docketEntries,
      docketRecordFilter,
    });

  return {
    countOfDocumentsForDownload: documentsIdsForDownload.length,
    showBatchDownloadControls: permissions.BATCH_DOWNLOAD_CASE_DOCUMENTS,
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelTextMobile,
  };
};
