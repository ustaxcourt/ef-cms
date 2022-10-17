import { state } from 'cerebral';

export const practitionerDocumentationHelper = (get, applicationContext) => {
  const permissions = get(state.permissions);
  const practitionerDocuments = get(state.practitionerDocuments);

  const formattedPractitionerDocuments = practitionerDocuments.map(document => {
    return {
      ...document,
      formattedUploadDate: applicationContext
        .getUtilities()
        .formatDateString(document.uploadDate, 'MMDDYY'),
    };
  });

  formattedPractitionerDocuments.sort((a, b) =>
    a.uploadDate.localeCompare(b.uploadDate),
  );

  const practitionerDocumentsCount = practitionerDocuments.length;

  return {
    formattedPractitionerDocuments,
    practitionerDocumentsCount,
    showDocumentationTab: permissions.UPLOAD_PRACTITIONER_DOCUMENT,
  };
};
