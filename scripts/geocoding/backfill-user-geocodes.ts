#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { backfillUserGeocodes } from 'scripts/helpers/backfillUserGeocodes';

const scriptConfig: ScriptConfig = {
  description:
    'backfill-user-geocodes - Geocode addresses for users missing lat/lng',
  // environment: {
  //   env: 'ENV',
  //   region: 'REGION',
  // },
  parameters: {
    batchSize: { default: '10000', type: 'string' },
    delayMs: { default: '60000', type: 'string' },
    dryRun: { default: false, type: 'boolean' },
  },
  // requireActiveAwsSession: true,
};

const { batchSize, delayMs, dryRun } = parseArgsAndEnvVars(scriptConfig) as {
  batchSize: number;
  delayMs: number;
  dryRun: boolean;
};

void (async () => {
  await backfillUserGeocodes({ batchSize, delayMs, dryRun });
})();
