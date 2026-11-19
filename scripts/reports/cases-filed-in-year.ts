#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { casesFiledInYear } from './cases-filed-in-year.helpers';
import {
  getNowObject,
  getTimeframeForYear,
} from '@shared/business/utilities/DateHandler';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'cases-filed-in-year - Generates a CSV of, or aggregate stats about, cases filed within the given year.',
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
      default: `${thisYear}`,
      position: 0,
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
const filename = `${OUTPUT_DIR}/cases-filed-in-${fiscal ? 'fy-' : ''}${year}.csv`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await casesFiledInYear({ begin, end, filename, stats });
})();
