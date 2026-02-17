#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { backfillUserGeocodes } from './backfillUserGeocodes';

const scriptConfig: ScriptConfig = {
  description:
    'backfill-user-geocodes - Geocode addresses for users missing lat/lng',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
  parameters: {
    batchSize: { default: '10000', transform: 'number', type: 'string' },
    delayMs: { default: '60000', transform: 'number', type: 'string' },
  },
  requireActiveAwsSession: true,
};

const { batchSize, delayMs } = parseArgsAndEnvVars(scriptConfig) as {
  batchSize: number;
  delayMs: number;
};

void (async () => {
  await backfillUserGeocodes({ batchSize, delayMs });
})();
