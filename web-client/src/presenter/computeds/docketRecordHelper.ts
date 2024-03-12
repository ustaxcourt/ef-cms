import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { getDocketEntriesByFilter } from '@web-client/presenter/computeds/formattedDocketEntries';
import { state } from '@web-client/presenter/app.cerebral';

export const docketRecordHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );
  const { docketRecordFilter, docketRecordSort } = get(state.sessionMetadata);

  const docketNumber = get(state.caseDetail.docketNumber);
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabelsMobile = {
    byDate: 'Oldest to Newest',
    byDateDesc: 'Newest to Oldest',
  };

  const sortLabelTextMobile = sortLabelsMobile[sortOrder];

  const isDownloadButtonLinkDisabled = false;

  const countOfDocumentsForDownload = getDocketEntriesByFilter(
    applicationContext,
    { docketEntries: documentsSelectedForDownload, docketRecordFilter },
  ).length;

  return {
    countOfDocumentsForDownload,
    isDownloadButtonLinkDisabled,
    showDownloadLink: showPrintableDocketRecord,
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelTextMobile,
  };
};
