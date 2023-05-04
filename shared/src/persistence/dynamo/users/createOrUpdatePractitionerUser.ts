import * as client from '../../dynamodbClientService';
import { ROLES } from '../../../business/entities/EntityConstants';
import { isUserAlreadyCreated } from './createOrUpdateUser';

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
  applicationContext: IApplicationContext;
  user: RawUser;
}) => {
  let userId = applicationContext.getUniqueId();
  const practitionerRoleTypes = [
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

  const userExists = await isUserAlreadyCreated({
    applicationContext,
    email: userEmail,
    userPoolId: process.env.USER_POOL_ID as string,
  });

  if (!userExists) {
    let baseCreateUserParams = {
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

    const createUserParamsLocal = {
      ...baseCreateUserParams,
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        ...baseCreateUserParams.UserAttributes,
        {
          Name: 'custom:userId',
          Value: user.userId,
        },
      ],
      Username: user.userId,
    };

    const createUserParams = process.env.USE_COGNITO_LOCAL
      ? createUserParamsLocal
      : baseCreateUserParams;

    const response = await applicationContext
      .getCognito()
      .adminCreateUser(createUserParams)
      .promise();

    if (process.env.USE_COGNITO_LOCAL) {
      ({ userId } = user);
    } else if (response && response.User && response.User.Username) {
      userId = response.User.Username;
    }
  } else {
    const response = await applicationContext
      .getCognito()
      .adminGetUser({
        UserPoolId: process.env.USER_POOL_ID,
        Username: userEmail,
      })
      .promise();

    await applicationContext
      .getCognito()
      .adminUpdateUserAttributes({
        UserAttributes: [
          {
            Name: 'custom:role',
            Value: user.role,
          },
        ],
        UserPoolId: process.env.USER_POOL_ID,
        Username: response.Username,
      })
      .promise();

    userId = response.Username;
  }

  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
