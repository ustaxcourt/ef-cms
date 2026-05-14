import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';

export const getPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, practitionerDocumentFileId },
): Promise<RawPractitionerDocument> => {
  return get({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/${practitionerDocumentFileId}`,
  });
};
