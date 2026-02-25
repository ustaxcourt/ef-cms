#!/usr/bin/env -S npx ts-node --transpile-only

import {
  CognitoIdentityProvider,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { runInBatches } from '../helpers/batch';
import { getEnabledCognitoUsers, resetUserPassword } from '../helpers/cognito';

const scriptConfig: ScriptConfig = {
  description:
    'reset-passwords - Resets the cognito password for all test users.',
  environment: {
    Password: 'DEFAULT_ACCOUNT_PASS',
    UserPoolId: 'USER_POOL_ID',
    region: 'REGION',
  },
  preventExecutionAgainst: ['prod'],
  requireActiveAwsSession: true,
};
const { Password, UserPoolId, region } = parseArgsAndEnvVars(scriptConfig) as {
  [k: string]: string;
};

const cognito = new CognitoIdentityProvider({ region });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const enabledUsers: UserType[] = await getEnabledCognitoUsers({
    cognito,
    UserPoolId,
  });

  const tasks: (() => Promise<boolean>)[] = enabledUsers.map(
    user => () => resetUserPassword({ cognito, Password, user, UserPoolId }),
  );

  await runInBatches(tasks);

  console.log("All enabled users' passwords have been reset.");
})();
