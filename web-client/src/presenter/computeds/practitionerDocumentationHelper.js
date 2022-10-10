import { state } from 'cerebral';

export const practitionerDocumentationHelper = (get, applicationContext) => {
  // const documentationCategory = get(state.form.categoryType);
  const permissions = get(state.permissions);
  const practitionerDocuments = get(state.practitionerDocuments);

  // const isCertificateOfGoodStanding =
  //   documentationCategory === 'Certificate of Good Standing';

  const formattedPractitionerDocuments = practitionerDocuments.map(document => {
    return {
      ...document,
      formattedUploadDate: applicationContext
        .getUtilities()
        .formatDateString(document.uploadDate, 'MMDDYY'),
    };
  });

  return {
    // isCertificateOfGoodStanding,
    formattedPractitionerDocuments,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};
