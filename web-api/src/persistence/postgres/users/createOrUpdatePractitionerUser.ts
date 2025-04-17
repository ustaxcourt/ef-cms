import {
  ROLES,
  Role,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { applicationContext } from '@web-api/applicationContext';
import { createUser } from '@web-api/gateways/user/createUser';
import { updateUser } from '@web-api/gateways/user/updateUser';
import { getUserByEmail } from './getUserByEmail';
import { getUniqueId } from '@shared/sharedAppContext';
import { createUserRecord } from './createUserRecord';
import { createPractitionerRecord } from '@web-api/persistence/postgres/practitioners/createPractitionerRecord';

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
    const existingUser = await getUserByEmail({ email: userEmail });

    if (!existingUser) {
      await createUser(applicationContext, {
        email: userEmail,
        name: user.name,
        role: user.role,
        sendWelcomeEmail: true,
        userId,
      });
    } else {
      await updateUser(applicationContext, {
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

  return await createPractitionerRecord({
    practitioner: user,
    userId,
  });
};
