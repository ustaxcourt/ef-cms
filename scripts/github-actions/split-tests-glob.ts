#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { splitTestsGlob } from './split-tests.helpers';

// Usage:
//  CI_NODE_TOTAL=6 CI_NODE_INDEX=0 TEST_FILE_TIMINGS_PATH=api-times.json scripts/github-actions/split-tests-glob.ts webApi

const scriptConfig: ScriptConfig = {
  description: 'split-tests-glob - Balances Jest tests across CI shards',
  environment: {
    // split-tests.helpers accesses these directly, so we require them here
    ciNodeIndex: 'CI_NODE_INDEX',
    ciNodeTotal: 'CI_NODE_TOTAL',
    testFileTimingsPath: 'TEST_FILE_TIMINGS_PATH',
  },
  parameters: {
    jestSuite: {
      description:
        'A camelCase Jest suite. See jestSuites in split-tests.helpers.ts',
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { jestSuite } = parseArgsAndEnvVars(scriptConfig) as {
  jestSuite: string;
};

splitTestsGlob(jestSuite);
