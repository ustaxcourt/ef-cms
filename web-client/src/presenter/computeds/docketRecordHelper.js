import { state } from 'cerebral';

export const docketRecordHelper = get => {
  const permissions = get(state.permissions);
  const currentPage = get(state.currentPage);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const showDirectDownloadLink = !permissions.UPDATE_CASE;
  const showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT &&
    ['CaseDetail'].includes(currentPage) &&
    userAssociatedWithCase;

  const canShowEditDocketEntryLink = permissions.DOCKET_ENTRY;

  return {
    canShowEditDocketEntryLink,
    showDirectDownloadLink,
    showDocumentDetailLink: !showDirectDownloadLink,
    showEditDocketEntry: permissions.DOCKET_ENTRY,
    showFileDocumentButton,
  };
};
