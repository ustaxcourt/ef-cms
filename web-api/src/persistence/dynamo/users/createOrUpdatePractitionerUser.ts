import * as client from '../../dynamodbClientService';
import { AdminCreateUserCommandInput } from '@aws-sdk/client-cognito-identity-provider';
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
    let params: AdminCreateUserCommandInput = {
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: userEmail,
        },
        {
          Name: 'custom:role',
          Value: user.role,
        },
        {
          Name: 'name',
          Value: user.name,
        },
      ],
      UserPoolId: process.env.USER_POOL_ID,
      Username: userEmail,
    };

    if (process.env.STAGE !== 'prod') {
      params.TemporaryPassword = process.env.DEFAULT_ACCOUNT_PASS;
    }

    const response = await applicationContext
      .getCognito()
      .adminCreateUser(params);

    if (response?.User?.Username) {
      const userIdAttribute =
        response.User.Attributes?.find(element => {
          if (element.Name === 'custom:userId') {
            return element;
          }
        }) ||
        response.User.Attributes?.find(element => {
          if (element.Name === 'sub') {
            return element;
          }
        });
      userId = userIdAttribute?.Value!;
    }
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
