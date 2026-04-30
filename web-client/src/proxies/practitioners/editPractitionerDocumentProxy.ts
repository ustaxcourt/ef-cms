import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const editPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, documentMetadata },
): Promise<RawPractitionerDocument> => {
  return put({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
