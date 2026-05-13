#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { downloadHistoricalTestFileTimes } from './download-historical-test-file-times.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'download-historical-test-file-times - Downloads historical test file times from a GitHub Actions artifact',
  environment: {
    // download-historical-test-file-times.helpers accesses these directly, so we require them here
    githubRepository: 'GITHUB_REPOSITORY',
    githubToken: 'GITHUB_TOKEN',
  },
  parameters: {
    artifactName: {
      position: 1,
      required: true,
      type: 'string',
    },
    outputFilePath: {
      position: 2,
      required: true,
      type: 'string',
    },
    workflowFileName: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};
const { artifactName, outputFilePath, workflowFileName } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  [k: string]: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await downloadHistoricalTestFileTimes({
    artifactName,
    outputFilePath,
    workflowFileName,
  });
})();
