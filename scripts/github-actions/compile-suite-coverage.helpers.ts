import fs from 'fs';
import path from 'path';
import {
  COVERAGE_SUITES,
  getCoverageSummary as getStoredCoverageSummary,
} from './suite-coverage.helpers';

export type CompileSuiteCoverageConfig = {
  githubRepository: string;
  githubToken: string;
  headSha?: string;
  outputDirectory: string;
  pullRequestNumber: number;
};

export type CompileSuiteCoverageDependencies = {
  getCoverageSummary: typeof getStoredCoverageSummary;
  mkdirSync: typeof fs.mkdirSync;
  writeFileSync: typeof fs.writeFileSync;
  log: (message: string) => void;
  error: (message: string) => void;
};

export const compileSuiteCoverage = async (
  {
    githubRepository,
    githubToken,
    headSha,
    outputDirectory,
    pullRequestNumber,
  }: CompileSuiteCoverageConfig,
  {
    error,
    getCoverageSummary,
    log,
    mkdirSync,
    writeFileSync,
  }: CompileSuiteCoverageDependencies,
): Promise<void> => {
  let downloadedCount = 0;

  for (const suite of COVERAGE_SUITES) {
    log(`Downloading coverage summary for ${suite}...`);
    try {
      const summary = await getCoverageSummary({
        headSha,
        pullRequestNumber,
        repository: githubRepository,
        suite,
        token: githubToken,
      });

      if (summary) {
        const suiteOutputDir = path.join(outputDirectory, suite);
        mkdirSync(suiteOutputDir, { recursive: true });

        const istanbulSummary = {
          total: {
            branches: {
              covered: summary.branches,
              pct: summary.branches,
              skipped: 0,
              total: 100,
            },
            functions: {
              covered: summary.functions,
              pct: summary.functions,
              skipped: 0,
              total: 100,
            },
            lines: {
              covered: summary.lines,
              pct: summary.lines,
              skipped: 0,
              total: 100,
            },
            statements: {
              covered: summary.statements,
              pct: summary.statements,
              skipped: 0,
              total: 100,
            },
          },
        };

        writeFileSync(
          path.join(suiteOutputDir, 'coverage-summary.json'),
          JSON.stringify(istanbulSummary, null, 2),
          'utf8',
        );
        downloadedCount++;
      } else {
        log(`No coverage summary found for suite: ${suite}`);
      }
    } catch (err) {
      error(`Error downloading coverage summary for ${suite}: ${err}`);
    }
  }

  if (downloadedCount === 0) {
    throw new Error('No coverage summaries were downloaded.');
  }

  log(`Successfully compiled ${downloadedCount} suite coverage summaries.`);
};

export const runCompileSuiteCoverageScript = async (
  config: CompileSuiteCoverageConfig,
): Promise<void> => {
  await compileSuiteCoverage(config, {
    error: console.error,
    getCoverageSummary: getStoredCoverageSummary,
    log: console.log,
    mkdirSync: fs.mkdirSync,
    writeFileSync: fs.writeFileSync,
  });
};
