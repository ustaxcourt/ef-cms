import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);

  return {
    showEditDocketRecordEntry: permissions.EDIT_DOCKET_ENTRY,
  };
};
