import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerDocumentsInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}/documents`,
  });
};
