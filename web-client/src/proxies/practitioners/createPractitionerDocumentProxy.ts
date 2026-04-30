import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const createPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, documentMetadata },
): Promise<RawPractitionerDocument> => {
  return post({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
