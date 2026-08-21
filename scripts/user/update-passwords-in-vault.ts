#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { invokePasswordUpdateLambdaInVaultAccount } from './rotate-environment-secrets.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'update-passwords-in-vault - Invokes the password rotation lambda in the ' +
    "vault account with this environment's default account password",
  environment: {
    defaultAccountPass: 'DEFAULT_ACCOUNT_PASS',
    env: 'ENV',
    region: 'REGION',
    vaultAccountId: 'VAULT_ACCOUNT_ID',
  },
  requireActiveAwsSession: true,
};
const { defaultAccountPass, env, region, vaultAccountId } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  defaultAccountPass: string;
  env: string;
  region: string;
  vaultAccountId: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const result = await invokePasswordUpdateLambdaInVaultAccount({
    env,
    newPassword: defaultAccountPass,
    region,
    vaultAccountId,
  });
  console.log(result);
})();
