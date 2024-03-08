import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getUserById } from './getUserById';
import { updateUserRecords } from './updateUserRecords';

export const updatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
}) => {
  const { userId } = user;

  const oldUser = await getUserById({
    applicationContext,
    userId,
  });

  try {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: {
        role: user.role,
      },
      email: user.email ? user.email : user.pendingEmail,
    });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  const updatedUser = await updateUserRecords({
    applicationContext,
    oldUser,
    updatedUser: user,
    userId,
  });

  return updatedUser;
};
