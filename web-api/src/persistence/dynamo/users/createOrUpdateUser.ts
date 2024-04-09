import * as client from '../../dynamodbClientService';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
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

export const createOrUpdateUser = async ({
  applicationContext,
  user,
}: {
  applicationContext: ServerApplicationContext;
  user: RawUser;
}) => {
  const { email } = user;

  if (!email) {
    throw new Error('expected email to be defined');
  }

  let userPoolId =
    user.role === ROLES.irsSuperuser
      ? process.env.USER_POOL_IRS_ID
      : process.env.USER_POOL_ID;

  const foundUser = await applicationContext
    .getUserGateway()
    .getUserByEmail(applicationContext, {
      email,
      poolId: userPoolId,
    });

  if (!foundUser) {
    const userId = applicationContext.getUniqueId();

    await applicationContext.getUserGateway().createUser(applicationContext, {
      attributesToUpdate: {
        email,
        name: user.name,
        role: user.role,
        userId,
      },
      email,
      poolId: userPoolId,
    });

    return await createUserRecords({
      applicationContext,
      user,
      userId,
    });
  } else {
    await applicationContext.getUserGateway().updateUser(applicationContext, {
      attributesToUpdate: {
        role: user.role,
      },
      email,
      poolId: userPoolId,
    });
    return await createUserRecords({
      applicationContext,
      user,
      userId: foundUser.userId,
    });
  }
};
