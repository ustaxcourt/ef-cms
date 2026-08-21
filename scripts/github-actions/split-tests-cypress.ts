#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { splitTestsCypress } from './split-tests.helpers';

// Usage:
//  CI_NODE_TOTAL=6 CI_NODE_INDEX=0 TEST_FILE_TIMINGS_PATH=accessibility-times.json scripts/github-actions/split-tests-cypress.ts accessibility

const scriptConfig: ScriptConfig = {
  description: 'split-tests-cypress - Balances Cypress tests across CI shards',
  environment: {
    // split-tests.helpers accesses these directly, so we require them here
    ciNodeIndex: 'CI_NODE_INDEX',
    ciNodeTotal: 'CI_NODE_TOTAL',
    testFileTimingsPath: 'TEST_FILE_TIMINGS_PATH',
  },
  parameters: {
    cypressSuite: {
      description:
        'A camelCase Cypress suite. See cypressSuites in split-tests.helpers.ts',
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { cypressSuite } = parseArgsAndEnvVars(scriptConfig) as {
  cypressSuite: string;
};

splitTestsCypress(cypressSuite);
