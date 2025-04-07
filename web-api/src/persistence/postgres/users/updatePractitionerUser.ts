import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { updateUser as updateUserFromGateWay } from '@web-api/gateways/user/updateUser';
import { updateUser } from './updateUser';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const updatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
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

  return await updateUser({
    userToUpdate: user,
  });
};
