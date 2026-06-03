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
  const summaries: (any | undefined)[] = await Promise.all(
    COVERAGE_SUITES.map(async suite => {
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

          return istanbulSummary;
        } else {
          log(`No coverage summary found for suite: ${suite}`);
          return undefined;
        }
      } catch (err) {
        error(`Error downloading coverage summary for ${suite}: ${err}`);
        return undefined;
      }
    }),
  );

  const missingSuites = COVERAGE_SUITES.filter((_, index) => !summaries[index]);

  if (missingSuites.length > 0) {
    throw new Error(
      `Coverage summary artifacts are not ready for PR #${pullRequestNumber}. Missing: ${missingSuites.join(', ')}.`,
    );
  }

  COVERAGE_SUITES.forEach((suite, index) => {
    const summary = summaries[index]!;
    const suiteOutputDir = path.join(outputDirectory, suite);
    mkdirSync(suiteOutputDir, { recursive: true });

    writeFileSync(
      path.join(suiteOutputDir, 'coverage-summary.json'),
      JSON.stringify(summary, null, 2),
      'utf8',
    );
  });

  log(
    `Successfully compiled ${COVERAGE_SUITES.length} suite coverage summaries.`,
  );
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
