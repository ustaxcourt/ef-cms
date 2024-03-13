import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { getDocketEntriesByFilter } from './formattedDocketEntries';
import { state } from '@web-client/presenter/app.cerebral';

export const docketRecordHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );
  const { docketRecordSort } = get(state.sessionMetadata);

  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntries = get(state.caseDetail.docketEntries);
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);
  const { docketRecordFilter } = get(state.sessionMetadata);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabelsMobile = {
    byDate: 'Oldest to Newest',
    byDateDesc: 'Newest to Oldest',
  };

  const sortLabelTextMobile = sortLabelsMobile[sortOrder];

  const documentsToDownload: RawDocketEntry[] =
    documentsSelectedForDownload.map(docSelected => {
      const docketEntryIdKey = Object.keys(docSelected)[0];
      return docketEntries.find(
        docEntry =>
          docEntry[docketEntryIdKey] === docSelected[docketEntryIdKey],
      );
    });

  const filteredDocuments = getDocketEntriesByFilter(applicationContext, {
    docketEntries: documentsToDownload,
    docketRecordFilter,
  });

  return {
    countOfDocumentsForDownload: filteredDocuments.length,
    showDownloadLink: showPrintableDocketRecord,
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelTextMobile,
  };
};
