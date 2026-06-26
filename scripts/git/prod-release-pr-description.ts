#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { prodReleasePrDescription } from './prod-release-pr-description.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'prod-release-pr-description - Generates the description for a production release pull request',
  environment: {
    env: 'ENV',
  },
  requireActiveAwsSession: true,
};

const { env } = parseArgsAndEnvVars(scriptConfig) as { env: string };
if (env !== 'prod') {
  console.error(
    'Error: must be run from a session that is pointed to the prod environment',
  );
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
prodReleasePrDescription();
