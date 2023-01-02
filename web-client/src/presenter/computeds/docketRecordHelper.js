import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );

  const docketRecordSort = get(state.sessionMetadata.docketRecordSort);
  const docketNumber = get(state.caseDetail.docketNumber);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabelsMobile = {
    byDate: 'Oldest to newest',
    byDateDesc: 'Newest to oldest',
  };

  const sortLabelTextMobile = sortLabelsMobile[sortOrder];

  return {
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelTextMobile,
  };
};
