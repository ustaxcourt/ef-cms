#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { convertTestFileTimesToJunit } from './test-file-times-to-junit.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'test-file-times-to-junit - Converts test file timing JSON into JUnit XML',
  parameters: {
    inputFilePath: {
      description: 'Path to the test file timing JSON input',
      position: 0,
      required: true,
      type: 'string',
    },
    outputFilePath: {
      description: 'Path to the JUnit XML output file',
      position: 1,
      required: true,
      type: 'string',
    },
    suiteName: {
      default: 'cypress',
      description: 'Suite name to include in the generated JUnit XML',
      position: 2,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { inputFilePath, outputFilePath, suiteName } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  inputFilePath: string;
  outputFilePath: string;
  suiteName: string;
};

convertTestFileTimesToJunit({
  inputFilePath,
  outputFilePath,
  suiteName,
});
