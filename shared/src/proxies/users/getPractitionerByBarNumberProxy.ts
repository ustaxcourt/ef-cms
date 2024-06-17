import { get } from '../requests';

export const getPractitionerByBarNumberInteractor = (
  applicationContext,
  { barNumber, isPublicUser }: { barNumber: string; isPublicUser: boolean },
) => {
  const endpoint = isPublicUser
    ? `/public-api/practitioners/${barNumber}`
    : `/practitioners/${barNumber}`;

  return get({
    applicationContext,
    endpoint,
  });
};
