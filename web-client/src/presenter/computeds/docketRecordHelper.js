import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);

  const showDirectDownloadLink = !permissions.UPDATE_CASE;

  return {
    showDirectDownloadLink,
    showDocumentDetailLink: !showDirectDownloadLink,
    showEditDocketEntry:
      permissions.DOCKET_ENTRY || permissions.CREATE_ORDER_DOCKET_ENTRY,
  };
};
