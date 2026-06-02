import {
  type UpdateProdReleaseCoverageDependencies,
  updateProdReleaseCoverage,
} from './update-prod-release-coverage.helpers';
import type { CoverageSummary } from './suite-coverage.helpers';
import { runUpdateProdReleaseCoverageScript } from './update-prod-release-coverage.helpers';
import * as suiteCoverageHelpers from './suite-coverage.helpers';

jest.mock('./suite-coverage.helpers', () => ({
  ...jest.requireActual('./suite-coverage.helpers'),
  getCoverageSummary: jest.fn(),
  updatePullRequestCoverage: jest.fn(),
}));

describe('update-prod-release-coverage', () => {
  const apiCoverageSummary: CoverageSummary = {
    branches: 90.12,
    functions: 91.23,
    lines: 92.34,
    statements: 93.45,
    suite: 'api',
  };
  const clientCoverageSummary: CoverageSummary = {
    branches: 94.56,
    functions: 95.67,
    lines: 96.78,
    statements: 97.89,
    suite: 'client',
  };
  const baseConfig = {
    githubRepository: 'ustaxcourt/ef-cms',
    githubToken: 'gh-token',
    headSha: 'release-head-sha',
    pullRequestNumber: 4321,
  };

  const getBaseDependencies = (): UpdateProdReleaseCoverageDependencies => ({
    getCoverageSummary: jest.fn(),
    log: jest.fn(),
    suites: ['api', 'client'],
    updatePullRequestCoverage: jest.fn(),
  });

  it('updates the release pull request when every suite coverage summary is ready', async () => {
    const dependencies = getBaseDependencies();

    jest
      .mocked(dependencies.getCoverageSummary)
      .mockResolvedValueOnce(apiCoverageSummary)
      .mockResolvedValueOnce(clientCoverageSummary);
    jest
      .mocked(dependencies.updatePullRequestCoverage)
      .mockResolvedValueOnce(true);

    await expect(
      updateProdReleaseCoverage(baseConfig, dependencies),
    ).resolves.toBe(true);

    expect(dependencies.getCoverageSummary).toHaveBeenNthCalledWith(1, {
      headSha: 'release-head-sha',
      pullRequestNumber: 4321,
      repository: 'ustaxcourt/ef-cms',
      suite: 'api',
      token: 'gh-token',
    });
    expect(dependencies.getCoverageSummary).toHaveBeenNthCalledWith(2, {
      headSha: 'release-head-sha',
      pullRequestNumber: 4321,
      repository: 'ustaxcourt/ef-cms',
      suite: 'client',
      token: 'gh-token',
    });
    expect(dependencies.updatePullRequestCoverage).toHaveBeenCalledWith({
      pullRequestNumber: 4321,
      repository: 'ustaxcourt/ef-cms',
      summaries: [apiCoverageSummary, clientCoverageSummary],
      token: 'gh-token',
    });
    expect(dependencies.log).toHaveBeenCalledWith(
      'Updated coverage rows on PR #4321.',
    );
  });

  it('logs and skips updating the release pull request when any suite summary is missing', async () => {
    const dependencies = getBaseDependencies();

    dependencies.suites = ['api', 'shared'];
    jest
      .mocked(dependencies.getCoverageSummary)
      .mockResolvedValueOnce(apiCoverageSummary)
      .mockResolvedValueOnce(undefined);

    await expect(
      updateProdReleaseCoverage(baseConfig, dependencies),
    ).resolves.toBe(false);

    expect(dependencies.updatePullRequestCoverage).not.toHaveBeenCalled();
    expect(dependencies.log).toHaveBeenCalledWith(
      'Coverage summary artifacts are not ready for PR #4321. Missing: shared.',
    );
  });

  it('logs when all summaries are ready but the release pull request body does not change', async () => {
    const dependencies = getBaseDependencies();

    jest
      .mocked(dependencies.getCoverageSummary)
      .mockResolvedValueOnce(apiCoverageSummary)
      .mockResolvedValueOnce(clientCoverageSummary);
    jest
      .mocked(dependencies.updatePullRequestCoverage)
      .mockResolvedValueOnce(false);

    await expect(
      updateProdReleaseCoverage(baseConfig, dependencies),
    ).resolves.toBe(false);

    expect(dependencies.log).toHaveBeenCalledWith(
      'No coverage update applied on PR #4321.',
    );
  });
  describe('runUpdateProdReleaseCoverageScript', () => {
    beforeEach(() => {
      jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('runs updateProdReleaseCoverage with DEFAULT_DEPENDENCIES', async () => {
      jest.mocked(suiteCoverageHelpers.getCoverageSummary).mockResolvedValue({
        branches: 1,
        functions: 1,
        lines: 1,
        statements: 1,
        suite: 'api',
      });
      jest
        .mocked(suiteCoverageHelpers.updatePullRequestCoverage)
        .mockResolvedValue(true);

      await runUpdateProdReleaseCoverageScript({
        githubRepository: 'ustaxcourt/ef-cms',
        githubToken: 'gh-token',
        headSha: 'release-head-sha',
        pullRequestNumber: 4321,
      });

      expect(suiteCoverageHelpers.getCoverageSummary).toHaveBeenCalled();
    });
  });
});
