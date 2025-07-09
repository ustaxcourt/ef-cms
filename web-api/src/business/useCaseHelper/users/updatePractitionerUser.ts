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
  const emailToUse = user.email ? user.email : user.pendingEmail;

  if (!emailToUse) {
    throw new Error('expected an email when updating a user record');
  }

  try {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: {
        role: user.role,
      },
      email: emailToUse,
    });
  } catch (error) {
    applicationContext.logger.error(error);
    throw error;
  }

  await upsertUsers([user]);

  return user;
};
