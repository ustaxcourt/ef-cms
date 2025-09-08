#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

const scriptConfig: ScriptConfig = {
  description: 'get-judge-name - Prints the judgeFullName for the provided userId',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    userId: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { userId } = parseArgsAndEnvVars(scriptConfig) as { userId: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const user = await getUserById({ userId });
  if (!user || !user.judgeFullName) {
    console.error(`Judge not found or missing judgeFullName for userId: ${userId}`);
    process.exit(1);
  }
  console.log(user.judgeFullName);
})();
