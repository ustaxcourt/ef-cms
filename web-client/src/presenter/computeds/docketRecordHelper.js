import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const showPrintableDocketRecord =
    get(state.caseDetail.status) !== CASE_STATUS_TYPES.new;

  return {
    showEditDocketRecordEntry: permissions.EDIT_DOCKET_ENTRY,
    showPrintableDocketRecord,
  };
};
