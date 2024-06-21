import { get } from '../requests';

export const getPractitionerByBarNumberInteractor = (
  applicationContext,
  { barNumber }: { barNumber: string },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
