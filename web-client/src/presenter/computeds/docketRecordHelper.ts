import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const docketRecordHelper = (get: Get): any => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );
  const docketRecordSort = get(state.sessionMetadata.docketRecordSort);
  const docketNumber = get(state.caseDetail.docketNumber);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabelsMobile = {
    byDate: 'Oldest to Newest',
    byDateDesc: 'Newest to Oldest',
  };

  const sortLabelTextMobile = sortLabelsMobile[sortOrder];

  const isDownloadButtonLinkDisabled = false;
  const showDownloadLink = showPrintableDocketRecord; // question: shoud showPrintableDocketRecord be the rule for displaying downloads as well?

  return {
    isDownloadButtonLinkDisabled,
    showDownloadLink,
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelTextMobile,
  };
};
