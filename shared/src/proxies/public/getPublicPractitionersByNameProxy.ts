import { ClientApplicationContext } from '@web-client/applicationContext';
import { PractitionersByName } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { get } from '../requests';

export const getPublicPractitionersByNameInteractor = (
  applicationContext: ClientApplicationContext,
  {
    name,
    searchAfter,
  }: {
    name: string;
    searchAfter: (string | number)[];
  },
): Promise<PractitionersByName> => {
  return get({
    applicationContext,
    endpoint: '/public-api/practitioners',
    params: {
      name,
      searchAfter,
    },
  });
};
