#!/usr/bin/env npx ts-node --transpile-only

import { type ScriptConfig, parseArguments } from './reports/reportUtils';
import {
  type ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['ENV', 'REGION']);

const scriptConfig: ScriptConfig = {
  description: 'TypeScript Shell Script Template',
  parameters: {
    eventCode: {
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
    year: {
      default: ['2024'],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const { eventCode, fiscal, verbose, year } = parseArguments(scriptConfig);
  const applicationContext: ServerApplicationContext = createApplicationContext(
    {},
  );
  console.log({ eventCode, fiscal, verbose, year });
  console.log(applicationContext.environment.stage);
})();
