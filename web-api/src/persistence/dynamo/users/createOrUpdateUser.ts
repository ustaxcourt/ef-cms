import * as client from '../../dynamodbClientService';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';

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

  if (user.section) {
    // we never have a need to query users by these sections, and since there are SO many
    // users in these sections, it locks up the migration.  We should use elasticsearch if we
    // have a future need to query for users by section
    if (
      user.section !== ROLES.privatePractitioner &&
      user.section !== ROLES.petitioner &&
      user.section !== ROLES.inactivePractitioner &&
      user.section !== ROLES.irsPractitioner
    ) {
      await client.put({
        Item: {
          pk: `section|${user.section}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }

    if (user.role === ROLES.judge || user.role === ROLES.legacyJudge) {
      await client.put({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }

    if (user.role === ROLES.caseServicesSupervisor) {
      await client.put({
        Item: {
          pk: `section|${DOCKET_SECTION}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
      await client.put({
        Item: {
          pk: `section|${PETITIONS_SECTION}`,
          sk: `user|${userId}`,
        },
        applicationContext,
      });
    }
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

  if (
    (user.role === ROLES.privatePractitioner ||
      user.role === ROLES.irsPractitioner) &&
    user.name &&
    user.barNumber
  ) {
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

export const isUserAlreadyCreated = async ({
  applicationContext,
  email,
  userPoolId,
}: {
  applicationContext: ServerApplicationContext;
  email: string;
  userPoolId: string;
}) => {
  try {
    await applicationContext.getCognito().adminGetUser({
      UserPoolId: userPoolId,
      Username: email,
    });
    return true;
  } catch (e) {
    if (e instanceof UserNotFoundException) {
      return false;
    } else {
      throw e;
    }
  }
};

export const createOrUpdateUser = async ({
  applicationContext,
  disableCognitoUser = false,
  password,
  user,
}: {
  applicationContext: ServerApplicationContext;
  disableCognitoUser: boolean;
  password: string;
  user: RawUser;
}) => {
  let userId;
  let userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  const userExists = await isUserAlreadyCreated({
    applicationContext,
    email: user.email,
    userPoolId: userPoolId as string,
  });

  if (!userExists) {
    const response = await applicationContext.getCognito().adminCreateUser({
      DesiredDeliveryMediums: ['EMAIL'],
      MessageAction: 'SUPPRESS',
      TemporaryPassword: password,
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: user.email,
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
      UserPoolId: userPoolId,
      Username: user.email,
    });
    // replace sub here
    userId = response.User!.Username;
  } else {
    const response = await applicationContext.getCognito().adminGetUser({
      UserPoolId: userPoolId,
      Username: user.email,
    });
    await applicationContext.getCognito().adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:role',
          Value: user.role,
        },
      ],
      UserPoolId: userPoolId,
      // and here
      Username: response.Username,
    });
    //and here
    userId = response.Username;
  }

  if (disableCognitoUser) {
    await applicationContext.getCognito().adminDisableUser({
      UserPoolId: userPoolId,
      Username: userId,
    });
  }

  return await createUserRecords({
    applicationContext,
    user,
    userId,
  });
};
