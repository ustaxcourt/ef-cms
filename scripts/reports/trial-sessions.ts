#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { createApplicationContext } from '@web-api/applicationContext';
import { trialSessionsReport } from './trial-sessions-report-helpers';

const scriptConfig: ScriptConfig = {
  description:
    'trial-sessions - Generates a CSV of trial sessions within the given year.',
  environment: {
    env: 'ENV',
    home: 'HOME',
    sourceTableVersion: 'SOURCE_TABLE_VERSION',
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
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { fiscal, home, stats, year } = parseArgsAndEnvVars(scriptConfig) as {
  fiscal: boolean;
  home: string;
  stats: boolean;
  year: number;
};

const OUTPUT_DIR = `${home}/Documents`;
const filename = `${OUTPUT_DIR}/${fiscal ? 'fy-' : ''}${year}-trial-sessions.csv`;
const start = fiscal
  ? `${year - 1}-10-01T04:00:00Z`
  : `${year}-01-01T05:00:00Z`;
const end = fiscal ? `${year}-10-01T04:00:00Z` : `${year + 1}-01-01T05:00:00Z`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  await trialSessionsReport({
    applicationContext,
    end,
    filename,
    start,
    stats,
  });
})();
