import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { PractitionerDocumentDownloadUrl } from '@web-api/business/useCases/practitioner/getPractitionerDocumentDownloadUrlInteractor';

export const getPractitionerDocumentDownloadUrlInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, practitionerDocumentFileId },
): Promise<PractitionerDocumentDownloadUrl> => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}/document-download-url`,
  });
};
