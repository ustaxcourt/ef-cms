import { remove } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const deletePractitionerDocumentInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber, practitionerDocumentFileId },
): Promise<void> => {
  return remove({
    applicationContext,
    endpoint: `/practitioner-documents/${barNumber}/documents/${practitionerDocumentFileId}`,
  });
};
