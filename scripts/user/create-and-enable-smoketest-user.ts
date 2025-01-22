#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createAndEnableSmoketestUser } from './create-and-enable-smoketest-user-helpers';

const scriptConfig: ScriptConfig = {
  description:
    'create-and-enable-smoketest-user - Creates and enables the smoketest user in ' +
    'a deployed DAWSON environment.',
  environment: {
    defaultAccountPass: 'DEFAULT_ACCOUNT_PASS',
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await createAndEnableSmoketestUser();
})();
