import { state } from 'cerebral';

export const practitionerDocumentationHelper = get => {
  const documentationCategory = get(
    state.screenMetadata.documentationCategoryDropdown.documentationCategory,
  );
  const permissions = get(state.permissions);

  const isCertificateOfGoodStanding =
    documentationCategory === 'Certificate of Good Standing';

  return {
    isCertificateOfGoodStanding,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};
