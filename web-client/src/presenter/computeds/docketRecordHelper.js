import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );

  const docketRecordSort = get(state.sessionMetadata.docketRecordSort);
  const docketNumber = get(state.caseDetail.docketNumber);

  const sortOrder = docketRecordSort[docketNumber];
  const sortLabels = {
    byDate: 'Oldest to newest',
    byDateDesc: 'Newest to oldest',
    byIndex: 'Order ascending',
    byIndexDesc: 'Order descending',
  };

  const sortLabelText = sortLabels[sortOrder];

  return {
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
    sortLabelText,
  };
};
