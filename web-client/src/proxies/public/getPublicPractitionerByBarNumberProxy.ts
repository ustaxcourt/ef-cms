import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPublicPractitionerByBarNumberInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber }: { barNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/practitioners/${barNumber}`,
  });
};
