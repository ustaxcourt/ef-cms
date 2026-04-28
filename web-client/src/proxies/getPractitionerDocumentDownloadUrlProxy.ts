import { get } from './requests';

export const getPractitionerDocumentDownloadUrlInteractor = (
  applicationContext,
  { barNumber, practitionerDocumentFileId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}/document-download-url`,
  });
};
