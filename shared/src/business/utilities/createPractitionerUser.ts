import { createBarNumber } from '@web-api/persistence/postgres/users/createBarNumber';
import { Practitioner, RawPractitioner } from '../entities/Practitioner';
import { getUniqueId } from '@shared/sharedAppContext';
import { ACCOUNT_STATUS } from '@shared/business/entities/EntityConstants';

type PractitionerInput = Omit<RawPractitioner, 'barNumber'> &
  Partial<Pick<RawPractitioner, 'barNumber'>>;

export const createPractitionerUser = async ({
  user,
}: {
  user: PractitionerInput;
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
    accountStatus: ACCOUNT_STATUS.active,
  })
    .validate()
    .toRawObject();
};
