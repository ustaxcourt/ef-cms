import { createBarNumber } from '@web-api/persistence/postgres/practitioners/barNumberGenerator';
import { Practitioner, RawPractitioner } from '../entities/Practitioner';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createPractitionerUser = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawPractitioner },
): Promise<RawPractitioner> => {
  const barNumber =
    user.barNumber ||
    (await createBarNumber({
      initials:
        user.lastName.charAt(0).toUpperCase() +
        user.firstName.charAt(0).toUpperCase(),
    }));

  return new Practitioner({
    ...user,
    barNumber,
    userId: applicationContext.getUniqueId(),
  })
    .validate()
    .toRawObject();
};
