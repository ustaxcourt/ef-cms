import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const practitionerDocumentationFormHelper = (get: Get): any => {
  const documentationCategory = get(state.form.categoryType);

  const isCertificateOfGoodStanding =
    documentationCategory === 'Certificate of Good Standing';

  return {
    isCertificateOfGoodStanding,
  };
};
