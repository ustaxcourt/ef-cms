import { state } from 'cerebral';

export const practitionerDocumentationHelper = get => {
  const documentationCategory = get(
    state.screenMetadata.documentationCategoryDropdown.documentationCategory,
  );

  const isCertificateOfGoodStanding =
    documentationCategory === 'Certificate of Good Standing';

  return {
    isCertificateOfGoodStanding,
  };
};
