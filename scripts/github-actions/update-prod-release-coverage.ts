#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { runUpdateProdReleaseCoverageScript } from './update-prod-release-coverage.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'update-prod-release-coverage - Updates the Coverage section in a prod release PR description',
  environment: {
    githubRepository: 'GITHUB_REPOSITORY',
    githubToken: 'GITHUB_TOKEN',
  },
  parameters: {
    headSha: {
      position: 1,
      required: false,
      type: 'string',
    },
    pullRequestNumber: {
      position: 0,
      required: true,
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { githubRepository, githubToken, headSha, pullRequestNumber } =
  parseArgsAndEnvVars(scriptConfig) as {
    githubRepository: string;
    githubToken: string;
    headSha?: string;
    pullRequestNumber: number;
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await runUpdateProdReleaseCoverageScript({
    githubRepository,
    githubToken,
    headSha,
    pullRequestNumber,
  });
})();
