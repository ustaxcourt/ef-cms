#!/usr/bin/env -S npx ts-node --transpile-only

import { eventCodesByYearReport } from './event-codes-by-year-helpers';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getNowObject } from '@shared/business/utilities/DateHandler';

const thisYear = getNowObject().year;
const scriptConfig: ScriptConfig = {
  description:
    'event-codes-by-year - Generate a CSV of instances of documents with the ' +
    'given event code(s) filed within the given duration.',
  environment: {
    env: 'ENV',
  },
  parameters: {
    count: {
      default: false,
      short: 'c',
      type: 'boolean',
    },
    distinct: {
      default: false,
      short: 'd',
      type: 'boolean',
    },
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
    pageCount: {
      default: false,
      short: 'p',
      type: 'boolean',
    },
    stricken: {
      default: false,
      short: 's',
      type: 'boolean',
    },
    years: {
      default: [`${thisYear}`],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const { count, distinct, eventCodes, fiscal, pageCount, stricken, years } =
  parseArgsAndEnvVars(scriptConfig) as {
    count: boolean;
    distinct: boolean;
    eventCodes: string[];
    fiscal: boolean;
    pageCount: boolean;
    stricken: boolean;
    years: number[];
  };

void (async () => {
  await eventCodesByYearReport({
    count,
    distinct,
    eventCodes,
    fiscal,
    pageCount,
    stricken,
    years,
  });
})();
