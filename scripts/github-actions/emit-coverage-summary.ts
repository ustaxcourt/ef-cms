#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  type CoverageSuite,
  writeCoverageSummary,
} from './suite-coverage.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'emit-coverage-summary - Converts Istanbul coverage-summary.json into the release coverage summary format',
  parameters: {
    inputFilePath: {
      position: 1,
      required: true,
      type: 'string',
    },
    outputFilePath: {
      position: 2,
      required: true,
      type: 'string',
    },
    suite: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { inputFilePath, outputFilePath, suite } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  inputFilePath: string;
  outputFilePath: string;
  suite: CoverageSuite;
};

writeCoverageSummary({
  inputFilePath,
  outputFilePath,
  suite,
});
