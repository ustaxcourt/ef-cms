import { state } from 'cerebral';

export const docketRecordHeaderHelper = get => {
  const permissions = get(state.permissions);
  const currentPage = get(state.currentPage);
  const userAssociatedWithCase = get(state.screenMetadata.isAssociated);

  const showFileDocumentButton =
    permissions.FILE_EXTERNAL_DOCUMENT &&
    ['CaseDetail'].includes(currentPage) &&
    userAssociatedWithCase;

  return {
    showFileDocumentButton,
  };
};
