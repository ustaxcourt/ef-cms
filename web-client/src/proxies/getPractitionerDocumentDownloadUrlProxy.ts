import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerDocumentDownloadUrlInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, practitionerDocumentFileId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}/document-download-url`,
  });
};
