import {
  ROLES,
  Role,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getUserGateway } from '@web-api/getUserGateway';
import { createUser } from '@web-api/persistence/postgres/users/createUser';

export const upsertPractitioner = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: Omit<RawUser, 'userId'>;
}) => {
  let userId = applicationContext.getUniqueId();
  const practitionerRoleTypes: Role[] = [
    ROLES.privatePractitioner,
    ROLES.irsPractitioner,
    ROLES.inactivePractitioner,
  ];

  if (!practitionerRoleTypes.includes(user.role)) {
    throw new Error(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
    );
  }

  const userEmail = user.email || user.pendingEmail;

  if (userEmail) {
    const existingUser = await applicationContext
      .getUserGateway()
      .getUserByEmail(applicationContext, {
        email: userEmail,
      });

    if (!existingUser) {
      await getUserGateway().createUser(applicationContext, {
        email: userEmail,
        name: user.name,
        role: user.role,
        sendWelcomeEmail: true,
        userId,
      });
    } else {
      await getUserGateway().updateUser(applicationContext, {
        attributesToUpdate: {
          role: user.role,
        },
        email: userEmail,
      });

      // eslint-disable-next-line prefer-destructuring
      userId = existingUser.userId;
    }
  }

  return await createUser({
    user,
    userId,
  });
};
