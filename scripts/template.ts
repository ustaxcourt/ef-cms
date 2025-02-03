#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';

// Example:
//   scripts/template.ts m073,m074 --fiscal -y 2018 --years 2020,2022-2024
const scriptConfig: ScriptConfig = {
  description: 'TypeScript Shell Script Template',
  environment: {
    env: 'ENV',
    region: 'REGION',
  },
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
  requireActiveAwsSession: true,
};
// Example:
//   {
//      env: 'myenv',
//      eventCodes: [ 'M073', 'M074' ],
//      fiscal: true,
//      verbose: false,
//      years: [ 2018, 2020, 2022, 2023, 2024 ]
//    }
const { env, eventCodes, fiscal, verbose, years } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  env: string;
  eventCodes: string[];
  fiscal: boolean;
  verbose: boolean;
  years: number[];
};

(() => {
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );
  console.log({ env, eventCodes, fiscal, verbose, years });
  console.log(applicationContext.environment.stage);
})();
