import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerByBarNumberInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber }: { barNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
