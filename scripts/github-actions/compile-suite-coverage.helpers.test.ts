import {
  type CompileSuiteCoverageDependencies,
  compileSuiteCoverage,
  runCompileSuiteCoverageScript,
} from './compile-suite-coverage.helpers';
import type { CoverageSummary } from './suite-coverage.helpers';
import path from 'path';
import fs from 'fs';
import * as suiteCoverageHelpers from './suite-coverage.helpers';

describe('compile-suite-coverage', () => {
  const mockApiSummary: CoverageSummary = {
    branches: 90.1,
    functions: 91.2,
    lines: 92.3,
    statements: 93.4,
    suite: 'api',
  };

  const baseConfig = {
    githubRepository: 'ustaxcourt/ef-cms',
    githubToken: 'gh-token',
    headSha: 'head-sha',
    outputDirectory: 'coverage',
    pullRequestNumber: 1234,
  };

  const getBaseDependencies = (): CompileSuiteCoverageDependencies => ({
    error: jest.fn(),
    getCoverageSummary: jest.fn(),
    log: jest.fn(),
    mkdirSync: jest.fn(),
    writeFileSync: jest.fn(),
  });

  it('downloads and saves coverage summaries for all available suites', async () => {
    const dependencies = getBaseDependencies();
    (dependencies.getCoverageSummary as jest.Mock)
      .mockResolvedValueOnce(mockApiSummary) // api
      .mockResolvedValueOnce({ ...mockApiSummary, suite: 'client' }) // client
      .mockResolvedValueOnce({ ...mockApiSummary, suite: 'scripts' }) // scripts
      .mockResolvedValueOnce({ ...mockApiSummary, suite: 'shared' }); // shared

    await compileSuiteCoverage(baseConfig, dependencies);

    expect(dependencies.getCoverageSummary).toHaveBeenCalledTimes(4);
    expect(dependencies.mkdirSync).toHaveBeenCalledTimes(4);
    expect(dependencies.writeFileSync).toHaveBeenCalledTimes(4);

    expect(dependencies.mkdirSync).toHaveBeenCalledWith(
      path.join('coverage', 'api'),
      { recursive: true },
    );
    expect(dependencies.writeFileSync).toHaveBeenCalledWith(
      path.join('coverage', 'api', 'coverage-summary.json'),
      JSON.stringify(
        {
          total: {
            branches: { covered: 90.1, pct: 90.1, skipped: 0, total: 100 },
            functions: { covered: 91.2, pct: 91.2, skipped: 0, total: 100 },
            lines: { covered: 92.3, pct: 92.3, skipped: 0, total: 100 },
            statements: { covered: 93.4, pct: 93.4, skipped: 0, total: 100 },
          },
        },
        null,
        2,
      ),
      'utf8',
    );
    expect(dependencies.log).toHaveBeenCalledWith(
      'Successfully compiled 4 suite coverage summaries.',
    );
  });

  it('logs an error when download fails for a suite but continues with others', async () => {
    const dependencies = getBaseDependencies();
    (dependencies.getCoverageSummary as jest.Mock)
      .mockRejectedValueOnce(new Error('Download failed')) // api
      .mockResolvedValueOnce(mockApiSummary) // client
      .mockResolvedValueOnce(undefined) // scripts
      .mockResolvedValueOnce(undefined); // shared

    await compileSuiteCoverage(baseConfig, dependencies);

    expect(dependencies.error).toHaveBeenCalledWith(
      expect.stringContaining(
        'Error downloading coverage summary for api: Error: Download failed',
      ),
    );
    expect(dependencies.log).toHaveBeenCalledWith(
      'Successfully compiled 1 suite coverage summaries.',
    );
  });

  it('throws an error when no coverage summaries were downloaded', async () => {
    const dependencies = getBaseDependencies();
    (dependencies.getCoverageSummary as jest.Mock).mockResolvedValue(undefined);

    await expect(
      compileSuiteCoverage(baseConfig, dependencies),
    ).rejects.toThrow('No coverage summaries were downloaded.');
  });

  it('runPrepareSuiteCoverageScript should call prepareSuiteCoverage with real dependencies', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => '');
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    jest
      .spyOn(suiteCoverageHelpers, 'getCoverageSummary')
      .mockResolvedValue(mockApiSummary);

    await runCompileSuiteCoverageScript(baseConfig);

    expect(suiteCoverageHelpers.getCoverageSummary).toHaveBeenCalled();
  });
});
