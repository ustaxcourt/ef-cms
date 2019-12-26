import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);

  const showDirectDownloadLink = !permissions.UPDATE_CASE;

  const canShowEditDocketEntryLink = permissions.DOCKET_ENTRY;

  return {
    canShowEditDocketEntryLink,
    showDirectDownloadLink,
    showDocumentDetailLink: !showDirectDownloadLink,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
  };
};
