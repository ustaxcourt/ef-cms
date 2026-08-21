import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPublicContact } from '@shared/business/entities/cases/PublicContact';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerByBarNumberInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber }: { barNumber: string },
): Promise<RawPractitioner | RawPublicContact[] | undefined> => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
