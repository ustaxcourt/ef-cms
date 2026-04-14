#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CognitoIdentityProvider,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { deleteUserFromCognito, getAllCognitoUsers } from '../helpers/cognito';
import { runInBatches } from '../helpers/batch';

const scriptConfig: ScriptConfig = {
  description:
    'clear-all-cognito-users - Deletes all cognito accounts in the provided user pool.',
  environment: {
    UserPoolId: 'USER_POOL_ID',
    region: 'REGION',
  },
  preventExecutionAgainst: ['prod'],
  requireActiveAwsSession: true,
};

const { UserPoolId, region } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const cognito = new CognitoIdentityProvider({ region });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const allUsers: UserType[] = await getAllCognitoUsers({
    cognito,
    UserPoolId,
  });

  const tasks: (() => Promise<boolean>)[] = allUsers.map(
    user => () => deleteUserFromCognito({ cognito, user, UserPoolId }),
  );

  await runInBatches(tasks);

  console.log('All users deleted.');
})();
