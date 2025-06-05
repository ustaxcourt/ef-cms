import { ROLES, Role } from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@web-api/applicationContext';
import { getUniqueId } from '@shared/sharedAppContext';
import { createUserRecord } from '../users/createUserRecord';
import { upsertPractitionerRecord } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecord';

export const createOrUpdatePractitionerUser = async ({
  user,
}: {
  user: Omit<RawUser, 'userId'>;
}) => {
  let userId = getUniqueId();
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
      await applicationContext.getUserGateway().createUser(applicationContext, {
        email: userEmail,
        name: user.name,
        role: user.role,
        sendWelcomeEmail: true,
        userId,
      });
    } else {
      await applicationContext.getUserGateway().updateUser(applicationContext, {
        attributesToUpdate: {
          role: user.role,
        },
        email: userEmail,
      });

      // eslint-disable-next-line prefer-destructuring
      userId = existingUser.userId;
    }
  }

  await createUserRecord({
    user,
    userId,
  });

  return await upsertPractitionerRecord({
    practitioner: user,
    userId,
  });
};
