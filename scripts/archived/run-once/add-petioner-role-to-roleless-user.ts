#!/usr/bin/env -S npx ts-node --transpile-only

import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'add-petitioner-role-to-roleless-user - Sets the custom:role attribute for Cognito users missing it.',
  environment: {
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

async function main() {
  const applicationContext = createApplicationContext({});
  const cognito = applicationContext.getCognito();
  const PAGE_SIZE = 10;

  let PaginationToken: string | undefined;
  let usersCompleted = 0;
  do {
    await new Promise(resolve => setTimeout(resolve, 300));
    const response = await cognito.listUsers({
      Limit: PAGE_SIZE,
      PaginationToken,
      UserPoolId: environment.userPoolId,
    });

    PaginationToken = response.PaginationToken;
    response.Users?.forEach(async user => {
      const userHasRole = user.Attributes?.find(
        cognitoAttribute => cognitoAttribute.Name === 'custom:role',
      );

      if (!userHasRole) {
        await cognito.adminUpdateUserAttributes({
          UserAttributes: [
            {
              Name: 'custom:role',
              Value: ROLES.petitioner,
            },
          ],
          UserPoolId: environment.userPoolId,
          Username: user.Username,
        });
        console.log('Updated: ', user.Username);
      }
    });

    usersCompleted = usersCompleted + PAGE_SIZE;
    console.log('Users Completed: ', usersCompleted);
  } while (PaginationToken);
}

void main();
