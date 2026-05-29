#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  readCoverageSummary,
  updatePullRequestCoverage,
} from './suite-coverage.helpers';

const scriptConfig: ScriptConfig = {
  description:
    'update-prod-release-coverage - Updates the Coverage section in a prod release PR description',
  environment: {
    githubRepository: 'GITHUB_REPOSITORY',
    githubToken: 'GITHUB_TOKEN',
  },
  parameters: {
    pullRequestNumber: {
      position: 1,
      required: true,
      transform: 'number',
      type: 'string',
    },
    summaryFilePath: {
      position: 0,
      required: true,
      type: 'string',
    },
  },
  requireActiveAwsSession: false,
};

const { githubRepository, githubToken, pullRequestNumber, summaryFilePath } =
  parseArgsAndEnvVars(scriptConfig) as {
    githubRepository: string;
    githubToken: string;
    pullRequestNumber: number;
    summaryFilePath: string;
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const summary = readCoverageSummary(summaryFilePath);
  const updated = await updatePullRequestCoverage({
    pullRequestNumber,
    repository: githubRepository,
    summary,
    token: githubToken,
  });

  console.log(
    updated
      ? `Updated coverage row for ${summary.suite} on PR #${pullRequestNumber}.`
      : `No coverage update applied for ${summary.suite} on PR #${pullRequestNumber}.`,
  );
})();
