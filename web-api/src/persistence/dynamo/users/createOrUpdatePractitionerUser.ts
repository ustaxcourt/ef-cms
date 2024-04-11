import * as client from '../../dynamodbClientService';
import {
  ROLES,
  Role,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createOrUpdatePractitionerUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
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

  if (!userEmail) {
    return await applicationContext.getPersistenceGateway().createUserRecords({
      applicationContext,
      user,
      userId,
    });
  }

  const existingUser = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email: userEmail,
    });

  if (!existingUser) {
    await applicationContext.getUserGateway().createUser(applicationContext, {
      attributesToUpdate: {
        email: userEmail,
        name: user.name,
        role: user.role,
        userId,
      },
      email: userEmail,
      resendInvitationEmail: false,
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

  return await applicationContext.getPersistenceGateway().createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
