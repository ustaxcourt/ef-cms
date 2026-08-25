#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { querySuppressionList } from './query-suppression-list.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'query-suppression-list - Finds suppressed email addresses by exact, partial, or wildcard match.',
  environment: {
    home: 'HOME',
    region: 'REGION',
  },
  parameters: {
    emailAddress: {
      position: 0,
      required: true,
      type: 'string',
    },
    exportResults: {
      default: false,
      long: 'export',
      short: 'x',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: true,
};

const { emailAddress, exportResults, region } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  emailAddress: string;
  exportResults: boolean;
  region: string;
};

void querySuppressionList({
  emailAddress,
  exportResults,
  region,
});
