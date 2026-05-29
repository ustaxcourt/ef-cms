#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import {
  COVERAGE_SUITES,
  type CoverageSuite,
  type CoverageSummary,
  getCoverageSummary,
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
  const coverageEntries = await Promise.all(
    COVERAGE_SUITES.map(
      async (suite): Promise<[CoverageSuite, CoverageSummary | undefined]> => {
        const summary = await getCoverageSummary({
          headSha,
          pullRequestNumber,
          repository: githubRepository,
          suite,
          token: githubToken,
        });

        return [suite, summary];
      },
    ),
  );
  const missingSuites = coverageEntries
    .filter((entry): entry is [CoverageSuite, undefined] => !entry[1])
    .map(([suite]) => suite);
  const summaries = coverageEntries
    .map(([_suite, summary]) => summary)
    .filter((summary): summary is CoverageSummary => summary !== undefined);

  if (missingSuites.length > 0) {
    console.log(
      `Coverage summary artifacts are not ready for PR #${pullRequestNumber}. Missing: ${missingSuites.join(', ')}.`,
    );

    return;
  }

  const updated = await updatePullRequestCoverage({
    pullRequestNumber,
    repository: githubRepository,
    summaries,
    token: githubToken,
  });

  console.log(
    updated
      ? `Updated coverage rows on PR #${pullRequestNumber}.`
      : `No coverage update applied on PR #${pullRequestNumber}.`,
  );
})();
