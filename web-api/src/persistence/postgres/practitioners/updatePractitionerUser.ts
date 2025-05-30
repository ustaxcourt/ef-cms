import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '@web-api/applicationContext';
import { updateUser } from '../users/updateUser';
import { updatePractitioner } from '@web-api/persistence/postgres/practitioners/updatePractitioner';

export const updatePractitionerUser = async ({
  user,
}: {
  user: RawPractitioner;
}) => {
  const emailToUpdate = user.email || user.pendingEmail;

  if (emailToUpdate) {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: { role: user.role },
      email: emailToUpdate,
    });
  }

  await updatePractitioner({ practitionerToUpdate: user });

  return await updateUser({
    userToUpdate: user,
  });
};
