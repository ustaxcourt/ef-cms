import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerDocumentsInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber },
): Promise<RawPractitionerDocument[]> => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
