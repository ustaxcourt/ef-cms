import { createBarNumber } from '@web-api/persistence/postgres/users/createBarNumber';
import { Practitioner, RawPractitioner } from '../entities/Practitioner';
import { getUniqueId } from '@shared/sharedAppContext';

export const createPractitionerUser = async ({
  user,
}: {
  user: RawPractitioner;
}): Promise<RawPractitioner> => {
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
    userId: getUniqueId(),
  })
    .validate()
    .toRawObject();
};
