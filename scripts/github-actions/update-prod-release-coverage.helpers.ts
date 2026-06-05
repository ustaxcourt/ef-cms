import {
  COVERAGE_SUITES,
  type CoverageSuite,
  type CoverageSummary,
  getCoverageSummary as getStoredCoverageSummary,
  updatePullRequestCoverage as updateStoredPullRequestCoverage,
} from './suite-coverage.helpers';

type GetCoverageSummary = typeof getStoredCoverageSummary;
type UpdatePullRequestCoverage = typeof updateStoredPullRequestCoverage;

export type UpdateProdReleaseCoverageConfig = {
  githubRepository: string;
  githubToken: string;
  headSha?: string;
  pullRequestNumber: number;
};

export type UpdateProdReleaseCoverageDependencies = {
  getCoverageSummary: GetCoverageSummary;
  log: (message: string) => void;
  suites: readonly CoverageSuite[];
  updatePullRequestCoverage: UpdatePullRequestCoverage;
};

const DEFAULT_DEPENDENCIES: UpdateProdReleaseCoverageDependencies = {
  getCoverageSummary: getStoredCoverageSummary,
  log: console.log,
  suites: COVERAGE_SUITES,
  updatePullRequestCoverage: updateStoredPullRequestCoverage,
};

export const updateProdReleaseCoverage = async (
  {
    githubRepository,
    githubToken,
    headSha,
    pullRequestNumber,
  }: UpdateProdReleaseCoverageConfig,
  {
    getCoverageSummary,
    log,
    suites,
    updatePullRequestCoverage,
  }: UpdateProdReleaseCoverageDependencies,
): Promise<boolean> => {
  const coverageEntries = await Promise.all(
    suites.map(
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
    log(
      `Coverage summary artifacts are not ready for PR #${pullRequestNumber}. Missing: ${missingSuites.join(', ')}.`,
    );

    return false;
  }

  const updated = await updatePullRequestCoverage({
    pullRequestNumber,
    repository: githubRepository,
    summaries,
    token: githubToken,
  });

  log(
    updated
      ? `Updated coverage rows on PR #${pullRequestNumber}.`
      : `No coverage update applied on PR #${pullRequestNumber}.`,
  );

  return updated;
};

export const runUpdateProdReleaseCoverageScript = async ({
  githubRepository,
  githubToken,
  headSha,
  pullRequestNumber,
}: {
  githubRepository: string;
  githubToken: string;
  headSha?: string;
  pullRequestNumber: number;
}): Promise<void> => {
  await updateProdReleaseCoverage(
    {
      githubRepository,
      githubToken,
      headSha,
      pullRequestNumber,
    },
    DEFAULT_DEPENDENCIES,
  );
};
