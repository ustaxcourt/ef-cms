import { PractitionersByName } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { get } from '../requests';

export const getPractitionersByNameInteractor = (
  applicationContext: IApplicationContext,
  {
    isPublicUser,
    name,
    searchAfter,
  }: {
    name: string;
    searchAfter: (string | number)[];
    isPublicUser: boolean;
  },
): Promise<PractitionersByName> => {
  const endpoint = isPublicUser
    ? '/public-api/practitioners'
    : '/practitioners';

  return get({
    applicationContext,
    endpoint,
    params: {
      name,
      searchAfter,
    },
  });
};
