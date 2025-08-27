import { getUniqueId } from '@shared/sharedAppContext';
import {
  ROLES,
  Role,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { getUserGateway } from '@web-api/getUserGateway';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { applicationContext } from '@web-api/applicationContext';

export const upsertPractitioner = async ({ user }: { user: RawUser }) => {
  let userId = user.userId || getUniqueId();
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
    const existingUser = await getUserGateway().getUserByEmail(
      applicationContext,
      {
        email: userEmail,
      },
    );

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

  const createdUser = { ...user, userId };

  await upsertUsers([createdUser]);

  return createdUser;
};
