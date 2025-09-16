#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { getUniqueId } from '@shared/sharedAppContext';

const scriptConfig: ScriptConfig = {
  description: 'setup-ustc-admin-user - creates the USTC admin user in Cognito',
  environment: {
    UserPoolId: 'COGNITO_USER_POOL',
    ustcAdminPass: 'USTC_ADMIN_PASS',
    ustcAdminUser: 'USTC_ADMIN_USER',
  },
  requireActiveAwsSession: true,
};
const { UserPoolId, ustcAdminPass, ustcAdminUser } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  [k: string]: string;
};

const cognitoClient = new CognitoIdentityProvider({
  region: 'us-east-1',
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const arbitraryUserId = getUniqueId();

  await cognitoClient.adminCreateUser({
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'email',
        Value: ustcAdminUser,
      },
      {
        Name: 'custom:userId',
        Value: arbitraryUserId,
      },
      {
        Name: 'custom:role',
        Value: 'admin',
      },
      {
        Name: 'name',
        Value: 'admin',
      },
    ],
    UserPoolId,
    Username: ustcAdminUser,
  });

  await cognitoClient.adminSetUserPassword({
    Password: ustcAdminPass,
    Permanent: true,
    UserPoolId,
    Username: ustcAdminUser,
  });

  await cognitoClient.adminDisableUser({
    UserPoolId,
    Username: ustcAdminUser,
  });

  console.log('Done!');
})();
