#!/usr/bin/env -S npx ts-node --transpile-only

/**
 * Updates the offboarded judge user in the Postgres database based on their userId passed in
 *
 * Usage:
 *   ./scripts/user/offboard-judge-user.ts 68686578-bc34-4aea-bc1d-25e505422843
 *
 * Arguments:
 *   - userId - The userId of the judge to offboard
 */

import { User } from '@shared/business/entities/User';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { disableUser } from '@web-api/gateways/user/disableUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertUsers } from '@web-api/persistence/postgres/users/upsertUsers';
import { getCognito } from '@web-api/persistence/cognito/getCognito';
import { environment } from '@web-api/environment';
import { UserType } from '@aws-sdk/client-cognito-identity-provider';

const scriptConfig: ScriptConfig = {
  description:
    'offboard-judge-user - Updates the offboarded judge user in the Postgres database and disables them in Cognito.',
  parameters: {
    userId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { userId } = parseArgsAndEnvVars(scriptConfig) as {
  userId: string;
};

const offboardJudgeUser = async () => {
  console.log(`Looking up judge user with userId: ${userId}`);
  const judgeUser = await getUserById({ userId });

  if (!judgeUser) {
    console.error(`Could not find judge user with userId: ${userId}`);
    process.exit(1);
  }

  console.log(`Retrieved Judge User: ${JSON.stringify(judgeUser, null, 2)}`);

  // Update the user's role and section to legacy values
  judgeUser.role = 'legacyJudge';
  judgeUser.section = 'legacyJudgesChambers';

  const rawUser = new User(judgeUser).validate().toRawObject();

  console.log('Updating user role and section in Postgres...');
  await upsertUsers([rawUser]);

  console.log(`Updated user ${userId} to role: legacyJudge, section: legacyJudgesChambers`);

  // Find the user in Cognito by their custom:userId attribute
  console.log('Looking up Cognito user by userId (this may take a while)...');
  let cognitoUser: UserType | undefined;
  let paginationToken: string | undefined;

  do {
    const result = await getCognito().listUsers({
      UserPoolId: environment.userPoolId,
      PaginationToken: paginationToken,
      Limit: 60,
    });

    cognitoUser = result.Users?.find(user =>
      user.Attributes?.some(attr =>
        attr.Name === 'custom:userId' && attr.Value === userId
      )
    );

    paginationToken = result.PaginationToken;
  } while (!cognitoUser && paginationToken);

  // Disable the user in Cognito
  if (cognitoUser) {
    const email = cognitoUser.Attributes?.find(attr => attr.Name === 'email')?.Value;
    if (email) {
      console.log(`Disabling Cognito user with email: ${email}`);
      await disableUser({ email });
      console.log('Successfully disabled Cognito user');
    } else {
      console.warn('No email found for Cognito user, skipping Cognito disable');
    }
  } else {
    console.warn('No Cognito user found with the provided userId, skipping Cognito disable');
  }

  console.log('Judge user offboarding completed successfully');
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  try {
    await offboardJudgeUser();
  } catch (error) {
    console.error('Error offboarding judge user:', error);
    process.exit(1);
  }
})();
