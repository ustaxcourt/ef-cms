#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  getTimeframeForYear,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { trialSessionsReport } from './trial-sessions-report-helpers';

const scriptConfig: ScriptConfig = {
  description:
    'trial-sessions - Generates a CSV of trial sessions within the given year.',
  environment: {
    env: 'ENV',
    home: 'HOME',
  },
  parameters: {
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    stats: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    year: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { fiscal, home, stats, year } = parseArgsAndEnvVars(scriptConfig) as {
  fiscal: boolean;
  home: string;
  stats: boolean;
  year: string;
};
const { begin, end } = getTimeframeForYear({ fiscal, year });

const OUTPUT_DIR = `${home}/Documents`;
const filename = `${OUTPUT_DIR}/${fiscal ? 'fy-' : ''}${year}-trial-sessions.csv`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await trialSessionsReport({ begin, end, filename, stats });
})();
