import { get } from '../requests';

export const getPublicPractitionerByBarNumberInteractor = (
  applicationContext,
  { barNumber }: { barNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/practitioners/${barNumber}`,
  });
};
