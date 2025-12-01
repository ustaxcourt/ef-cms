#!/usr/bin/env -S npx ts-node --transpile-only

import {
  AdminDeleteUserCommand,
  CognitoIdentityProvider,
  ListUsersCommand,
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
  let allUsers = [];
  let paginationToken: string | undefined = undefined;

  do {
    const command = new ListUsersCommand({
      UserPoolId,
      PaginationToken: paginationToken,
      Limit: 60,
    });

    try {
      const response = await cognito.send(command);
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
  const allUsers: any[] = await getAllCognitoUsers();

  if (allUsers.length > 0) {
    for (const user of allUsers) {
      console.log(allUsers);

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
    }
  } else {
    console.log('No cognito users.');
  }
})();
