#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from './helpers/parseArgsAndEnvVars';

// When this script is called like so...
//   scripts/template.ts m073,m074 --fiscal -y 2018 --years 2020,2022-2024
const scriptConfig: ScriptConfig = {
  description: 'template - TypeScript Shell Script Template',
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
const { env, eventCodes, fiscal, verbose, years } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  env: string;
  eventCodes: string[];
  fiscal: boolean;
  verbose: boolean;
  years: number[];
};
// ...the output from parseArgsAndEnvVars will look like this:
//   {
//      env: 'myenv',
//      eventCodes: [ 'M073', 'M074' ],
//      fiscal: true,
//      verbose: false,
//      years: [ 2018, 2020, 2022, 2023, 2024 ]
//    }

const placeholder = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  console.log({ env, eventCodes, fiscal, verbose, years });
  await placeholder();
})();
