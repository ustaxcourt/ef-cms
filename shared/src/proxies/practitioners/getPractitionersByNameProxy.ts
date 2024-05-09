import { PractitionersByName } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { get } from '../requests';

export const getPractitionersByNameInteractor = (
  applicationContext: IApplicationContext,
  { name, searchAfter }: { name: string; searchAfter: (string | number)[] },
): Promise<PractitionersByName> => {
  return get({
    applicationContext,
    endpoint: '/practitioners',
    params: {
      name,
      searchAfter,
    },
  });
};
