#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { cypressSuites } from './split-tests.helpers';
import {
  onOpen,
  onSpecs,
  onSuite,
} from './run-cypress-tests-with-timing.helpers';

const scriptConfig: ScriptConfig = {
  description: 'run-cypress-tests-with-timing - Runs Cypress tests',
  parameters: {
    browser: {
      required: false,
      short: 'b',
      type: 'string',
    },
    current: {
      description:
        'Run Cypress against the current color instead of the deploying color',
      required: false,
      short: 'c',
      type: 'boolean',
    },
    cypressSuite: {
      long: 'suite',
      required: false,
      short: 's',
      type: 'string',
    },
    file: {
      description:
        'Comma-delimited list of Cypress specs to run, relative to the project root',
      required: false,
      short: 'f',
      type: 'string',
    },
    open: {
      required: false,
      short: 'o',
      type: 'boolean',
    },
    outputFilePath: {
      long: 'output-file-path',
      required: false,
      short: 'p',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { browser, current, cypressSuite, file, open, outputFilePath } =
  parseArgsAndEnvVars(scriptConfig) as {
    browser?: string;
    current: boolean;
    cypressSuite?: string;
    file?: string;
    open: boolean;
    outputFilePath?: string;
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  if (cypressSuite && !(cypressSuite in cypressSuites)) {
    throw new Error(`Invalid Cypress suite: ${cypressSuite}`);
  }

  if (open) {
    return await onOpen({ browser, current, cypressSuite });
  }

  if (file) {
    return await onSpecs({ browser, current, file, outputFilePath });
  }

  return await onSuite({ browser, current, cypressSuite, outputFilePath });
})();
