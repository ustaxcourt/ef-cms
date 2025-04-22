import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { applicationContext } from '@web-api/applicationContext';
import { updateUser as updateUserFromGateWay } from '@web-api/gateways/user/updateUser';
import { updateUser } from '../users/updateUser';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { updatePractitioner } from '@web-api/persistence/postgres/practitioners/updatePractitioner';

export const updatePractitionerUser = async ({
  user,
}: {
  user: RawPractitioner;
}) => {
  const logger = getLogger();
  try {
    await updateUserFromGateWay(applicationContext, {
      attributesToUpdate: {
        role: user.role,
      },
      email: user.email ? user.email : user.pendingEmail,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }

  await updatePractitioner({ practitionerToUpdate: user });

  return await updateUser({
    userToUpdate: user,
  });
};
