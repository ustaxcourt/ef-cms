#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getRunStateOfMostRecentJobRun } from '../../shared/admin-tools/aws/glueHelper';

const scriptConfig: ScriptConfig = {
  description:
    'glue-job-status - Check the status of the most recent glue job.',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { env } = parseArgsAndEnvVars(scriptConfig) as { env: string };

if (env !== 'prod') {
  console.error('Glue jobs are performed in the production environment.');
  process.exit();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await getRunStateOfMostRecentJobRun(true);
})();
