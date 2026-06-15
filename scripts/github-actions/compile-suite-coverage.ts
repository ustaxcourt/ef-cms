#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { runCompileSuiteCoverageScript } from './compile-suite-coverage.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'prepare-suite-coverage - Downloads all suite coverage summaries and prepares them for badge generation',
  environment: {
    githubRepository: 'GITHUB_REPOSITORY',
    githubToken: 'GITHUB_TOKEN',
  },
  parameters: {
    outputDirectory: {
      position: 1,
      required: true,
      type: 'string',
    },
    pullRequestNumber: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const {
  githubRepository,
  githubToken,
  outputDirectory,
  pullRequestNumber: pullRequestNumberStr,
} = parseArgsAndEnvVars(scriptConfig) as {
  githubRepository: string;
  githubToken: string;
  outputDirectory: string;
  pullRequestNumber: string;
};

const pullRequestNumber = parseInt(pullRequestNumberStr.split(',')[0], 10);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await runCompileSuiteCoverageScript({
    githubRepository,
    githubToken,
    outputDirectory,
    pullRequestNumber,
  });
})();
