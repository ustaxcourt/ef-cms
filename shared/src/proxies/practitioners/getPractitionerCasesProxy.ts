import { get } from '../requests';

export const getPractitionerCasesInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${userId}/case-list`,
  });
};
