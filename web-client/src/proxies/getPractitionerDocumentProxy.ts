import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, practitionerDocumentFileId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}`,
  });
};
