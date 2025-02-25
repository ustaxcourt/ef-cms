#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { disableSmoketestUser } from './disable-smoketest-user-helpers';

const scriptConfig: ScriptConfig = {
  description:
    'disable-smoketest-user - Disables the smoketest user in a deployed DAWSON environment.',
  environment: {
    env: 'ENV',
    userPoolId: 'USER_POOL_ID',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await disableSmoketestUser();
})();
