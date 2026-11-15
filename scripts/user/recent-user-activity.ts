#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getRecentUserActivity } from './recent-user-activity.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'recent-user-activity - Lists recent logins and active users in a deployed DAWSON environment, ' +
    "based on the API lambda's CloudWatch logs. --staff limits results to ustaxcourt.gov users " +
    '(and drops SSO logins, which are logged without an email). --sample prints a few raw log lines.',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    minutes: {
      default: '15',
      description: 'look-back window in minutes',
      short: 'm',
      transform: 'number',
      type: 'string',
    },
    sample: {
      default: false,
      type: 'boolean',
    },
    staffOnly: {
      default: false,
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
  minutes: number;
  region: string;
  sample: boolean;
  staffOnly: boolean;
};

void getRecentUserActivity({ env, minutes, region, sample, staffOnly });
