import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord =
    get(state.caseDetail.canAllowPrintableDocketRecord) === true;

  return {
    showEditDocketRecordEntry: permissions.EDIT_DOCKET_ENTRY,
    showPrintableDocketRecord,
  };
};
