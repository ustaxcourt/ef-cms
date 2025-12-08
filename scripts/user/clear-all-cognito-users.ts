#!/usr/bin/env -S npx ts-node --transpile-only

import {
  AdminDeleteUserCommand,
  CognitoIdentityProvider,
  ListUsersCommand,
  ListUsersCommandOutput,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';

const scriptConfig: ScriptConfig = {
  description:
    'clear-all-cognito-users - Deletes all cognito accounts in the test environment.',
  environment: {
    Password: 'DEFAULT_ACCOUNT_PASS',
    UserPoolId: 'USER_POOL_ID',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};

const { UserPoolId, region } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const cognito = new CognitoIdentityProvider({ region });

const getAllCognitoUsers = async () => {
  let allUsers: UserType[] = [];
  let paginationToken: string | undefined = undefined;

  do {
    const command = new ListUsersCommand({
      UserPoolId,
      PaginationToken: paginationToken,
      Limit: 60,
    });

    try {
      const response: ListUsersCommandOutput = await cognito.send(command);
      if (response.Users) {
        allUsers = allUsers.concat(response.Users);
      }
      paginationToken = response.PaginationToken; // Get the token for the next page
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  } while (paginationToken); // Continue as long as there's a pagination token

  return allUsers;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const allUsers: UserType[] = await getAllCognitoUsers();

  const taskFns: (() => Promise<void>)[] = allUsers.map(user => {
    return async () => {
      const adminDeleteUserCommandInput = {
        UserPoolId,
        Username: user.Username,
      };

      try {
        const adminDeleteUserCommand = new AdminDeleteUserCommand(
          adminDeleteUserCommandInput,
        );

        await cognito.send(adminDeleteUserCommand);
        console.log('Deleted user: ', user.Username);
      } catch (error) {
        console.log('Error deleting user Username: ', user.Username);
      }
    };
  });

  // Run tasks in chunks of 15, awaiting each batch before continuing
  const concurrency = 15;
  for (let i = 0; i < taskFns.length; i += concurrency) {
    const batch = taskFns.slice(i, i + concurrency);
    console.log(
      'running batch:',
      batch.map((_, idx) => i + idx),
    );
    try {
      await Promise.all(batch.map(fn => fn()));
    } catch (err) {
      console.error('Error in batch:', err);
    }
    // small delay between batches to avoid bursting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('All users deleted.');
})();
