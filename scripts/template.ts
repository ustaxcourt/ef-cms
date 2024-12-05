#!/usr/bin/env npx ts-node --transpile-only

import { type ScriptConfig, parseArguments } from './helpers/parseArguments';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['ENV', 'REGION']);

// Example:
//   scripts/template.ts m073,m074 --fiscal -y 2018 --year 2020,2022-2024
const scriptConfig: ScriptConfig = {
  description: 'TypeScript Shell Script Template',
  parameters: {
    eventCodes: {
      commaDelimited: true,
      position: 0,
      required: true,
      transform: 'toUpperCase',
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    years: {
      default: ['2024'],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
};
// Example:
//   {
//      eventCodes: [ 'M073', 'M074' ],
//      fiscal: true,
//      verbose: false,
//      years: [ 2018, 2020, 2022, 2023, 2024 ]
//    }
const { eventCodes, fiscal, verbose, years } = parseArguments(scriptConfig) as {
  eventCodes: string[];
  fiscal: boolean;
  verbose: boolean;
  years: number[];
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );
  console.log({ eventCodes, fiscal, verbose, years });
  console.log(applicationContext.environment.stage);
})();
