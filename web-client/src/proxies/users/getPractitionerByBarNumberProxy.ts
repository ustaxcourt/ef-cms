import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getPractitionerByBarNumberInteractor = (
  applicationContext: ClientApplicationContext,
  { barNumber }: { barNumber: string },
): Promise<
  | RawPractitioner
  | Partial<RawPractitioner & { contact: { state: string } }>[]
  | undefined
> => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${barNumber}`,
  });
};
