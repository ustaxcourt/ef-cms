import { post } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const createPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, documentMetadata },
) => {
  return post({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
