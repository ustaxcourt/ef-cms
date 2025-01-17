#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ListUsersCommandOutput,
  UserStatusType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';

const scriptConfig: ScriptConfig = {
  description:
    'verifyLowerCasedCognitoUsers - Identifies cognito users with erroneously unverified email addresses.',
  environment: {
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  parameters: {
    dryRun: {
      default: false,
      long: 'dry',
      short: 'd',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};
const { dryRun } = parseArgsAndEnvVars(scriptConfig) as { dryRun: boolean };

(async () => {
  const applicationContext = createApplicationContext({});
  const start = Date.now();

  try {
    let paginationToken;
    let completedUsers = 0;

    do {
      const usersPerBatch = 10;

      const data = await applicationContext.getCognito().listUsers({
        Limit: usersPerBatch,
        PaginationToken: paginationToken,
        UserPoolId: applicationContext.environment.userPoolId,
      });

      await new Promise(resolve => setTimeout(resolve, 300));
      await verifyLowerCasedEmails(data, applicationContext);

      paginationToken = data.PaginationToken;
      completedUsers += usersPerBatch;

      console.log(
        `********** COMPLETED BATCH, total users migrated ${completedUsers} **********`,
      );
    } while (paginationToken);
  } catch (error) {
    console.error('Error updating users:', error);
  }
  console.log('Time to run: ', (Date.now() - start) / 1000, 's');
})();

async function verifyLowerCasedEmails(
  data: ListUsersCommandOutput,
  applicationContext: ServerApplicationContext,
): Promise<void> {
  const usersWhoHaveUnverifiedEmailsButShouldNot =
    data.Users?.filter(user => {
      const emailIsUnverified =
        user.Attributes?.find(attr => attr.Name === 'email_verified')?.Value ===
        'false';
      const userStatusType =
        user.UserStatus && user.UserStatus in UserStatusType
          ? UserStatusType[user.UserStatus]
          : UserStatusType.UNKNOWN;
      const userIsConfirmedOrForceChange =
        userStatusType === UserStatusType.CONFIRMED ||
        userStatusType === UserStatusType.FORCE_CHANGE_PASSWORD;

      return emailIsUnverified && userIsConfirmedOrForceChange;
    }) || [];

  await Promise.all(
    usersWhoHaveUnverifiedEmailsButShouldNot.map(user => {
      const userEmail = user.Attributes?.find(attr => {
        return attr.Name === 'email';
      })?.Value;
      const userSub = user.Attributes?.find(attr => {
        return attr.Name === 'sub';
      })?.Value;

      console.log('Email to update: ', userEmail);

      if (!dryRun) {
        return applicationContext.getCognito().adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'email_verified',
              Value: 'true',
            },
          ],
          UserPoolId: applicationContext.environment.userPoolId,
          Username: userSub,
        });
      }
    }),
  );
}
