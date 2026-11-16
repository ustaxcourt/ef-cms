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
  minutes: string;
  region: string;
  sample: boolean;
  staffOnly: boolean;
};

// Not the shared 'number' transform: it uses parseInt, which would quietly
// turn values like '1.5' or '60,90' into integers instead of rejecting them.
void getRecentUserActivity({
  env,
  minutes: Number(minutes),
  region,
  sample,
  staffOnly,
});
