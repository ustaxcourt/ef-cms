import * as client from '../../dynamodbClientService';
import {
  ROLES,
  Role,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const createUserRecords = async ({
  applicationContext,
  user,
  userId,
}: {
  applicationContext: IApplicationContext;
  user: any;
  userId: string;
}) => {
  delete user.password;

  if (user.barNumber === '') {
    delete user.barNumber;
  }

  await client.put({
    Item: {
      ...user,
      pk: `user|${userId}`,
      sk: `user|${userId}`,
      userId,
    },
    applicationContext,
  });

  if (user.name && user.barNumber) {
    const upperCaseName = user.name.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseName}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
    const upperCaseBarNumber = user.barNumber.toUpperCase();
    await client.put({
      Item: {
        pk: `${user.role}|${upperCaseBarNumber}`,
        sk: `user|${userId}`,
      },
      applicationContext,
    });
  }

  return {
    ...user,
    userId,
  };
};

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
    return await createUserRecords({
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

  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
