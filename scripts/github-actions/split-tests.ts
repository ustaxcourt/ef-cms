#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { splitTests } from './split-tests.helpers';

// Usage:
//  CI_NODE_TOTAL=6 CI_NODE_INDEX=0 TEST_FILE_TIMINGS_PATH=client-integration-public-times.json scripts/github-actions/split-tests.ts --public

const scriptConfig: ScriptConfig = {
  description:
    'split-tests - Balances client integration (private and public) tests across CI shards',
  environment: {
    // split-tests.helpers accesses these directly, so we require them here
    ciNodeIndex: 'CI_NODE_INDEX',
    ciNodeTotal: 'CI_NODE_TOTAL',
    testFileTimingsPath: 'TEST_FILE_TIMINGS_PATH',
  },
  parameters: {
    publicTests: {
      default: false,
      long: 'public',
      short: 'p',
      type: 'boolean',
    },
  },
  requireActiveAwsSession: false,
};
const { publicTests } = parseArgsAndEnvVars(scriptConfig) as {
  publicTests: boolean;
};

splitTests(publicTests);
