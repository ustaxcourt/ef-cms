import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';

export const updatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
}) => {
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

  await upsertUsers([user]);

  return user;
};
