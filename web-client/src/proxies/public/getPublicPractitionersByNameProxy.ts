import { ClientApplicationContext } from '@web-client/applicationContext';
import { PractitionersByName } from '@web-api/business/useCases/practitioner/getPractitionersByNameInteractor';
import { get } from '../requests';

export const getPublicPractitionersByNameInteractor = (
  applicationContext: ClientApplicationContext,
  {
    admissionStatus,
    name,
    originalBarState,
    searchAfter,
    practiceType,
    practitionerType,
  }: {
    admissionStatus?: string[];
    name: string;
    originalBarState?: string[];
    practiceType?: string[];
    practitionerType?: string;
    searchAfter: (string | number)[];
  },
): Promise<PractitionersByName> => {
  return get({
    applicationContext,
    endpoint: '/public-api/practitioners',
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
