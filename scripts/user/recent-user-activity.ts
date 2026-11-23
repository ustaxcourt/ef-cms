#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getRecentUserActivity } from './recent-user-activity.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'recent-user-activity - Lists recent logins and active users in a deployed DAWSON environment, ' +
    "based on the API lambda's CloudWatch logs.",
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    minutes: {
      default: '15',
      description: 'look-back window in minutes',
      short: 'm',
      type: 'string',
    },
    sample: {
      default: false,
      type: 'boolean',
    },
    staffOnly: {
      default: false,
      description: 'ustaxcourt.gov users only (omits SSO logins)',
      long: 'staff',
      short: 's',
      type: 'boolean',
    },
  },
  preventExecutionAgainst: ['local'],
  requireActiveAwsSession: true,
};

const { env, minutes, region, sample, staffOnly } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  env: string;
  minutes: string;
  region: string;
  sample: boolean;
  staffOnly: boolean;
};

void getRecentUserActivity({
  env,
  minutes: Number(minutes),
  region,
  sample,
  staffOnly,
});
