import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord = get(
    state.caseDetail.canAllowPrintableDocketRecord,
  );

  return {
    showEditOrSealDocketRecordEntry:
      permissions.EDIT_DOCKET_ENTRY || permissions.SEAL_DOCKET_ENTRY,
    showPrintableDocketRecord,
  };
};
