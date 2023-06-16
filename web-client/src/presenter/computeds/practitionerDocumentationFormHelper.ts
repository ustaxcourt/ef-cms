import { state } from '@web-client/presenter/app.cerebral';

export const practitionerDocumentationFormHelper = get => {
  const documentationCategory = get(state.form.categoryType);

  const isCertificateOfGoodStanding =
    documentationCategory === 'Certificate of Good Standing';

  return {
    isCertificateOfGoodStanding,
  };
};
