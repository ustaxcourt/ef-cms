#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { rotateSecrets } from './rotate-environment-secrets.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'rotate-environment-secrets - Rotates secrets in a deployed environment.',
  environment: {
    UserPoolId: 'COGNITO_USER_POOL',
    ci: 'CI',
    env: 'ENV',
    region: 'REGION',
  },
  requireActiveAwsSession: true,
};
const { ci, env, region, UserPoolId } = parseArgsAndEnvVars(scriptConfig) as {
  ci: string;
  env: string;
  region: string;
  UserPoolId: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await rotateSecrets({ ci, env, region, UserPoolId });
  console.log('🏁 All done');
})();
