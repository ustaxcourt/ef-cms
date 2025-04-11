import { ClientApplicationContext } from '@web-client/applicationContext';
import { PractitionersByName } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { get } from '../requests';

export const getPractitionersByNameInteractor = (
  applicationContext: ClientApplicationContext,
  {
    admissionStatus,
    name,
    originalBarState,
    searchAfter,
    practiceType,
    practitionerType,
  }: {
    admissionStatus?: string;
    name: string;
    originalBarState?: string;
    practiceType?: string;
    practitionerType?: string;
    searchAfter: (string | number)[];
  },
): Promise<PractitionersByName> => {
  return get({
    applicationContext,
    endpoint: '/practitioners',
    params: {
      admissionStatus,
      name,
      originalBarState,
      searchAfter,
      practiceType,
      practitionerType,
    },
  });
};
