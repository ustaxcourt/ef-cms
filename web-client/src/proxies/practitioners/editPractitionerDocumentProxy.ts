import { put } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const editPractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, documentMetadata },
) => {
  return put({
    applicationContext,
    body: documentMetadata,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
