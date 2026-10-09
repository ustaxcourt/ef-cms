import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

class ExitError extends Error {
  constructor(readonly code: number | undefined) {
    super(`process.exit(${code})`);
  }
}

const trivyResult = (ruleId: string, packageName: string) => ({
  locations: [
    { physicalLocation: { artifactLocation: { uri: 'package-lock.json' } } },
  ],
  message: {
    text: `Package: ${packageName}\nInstalled Version: 1.0.0\nVulnerability ${ruleId}\nSeverity: HIGH`,
  },
  ruleId,
});

const sarif = (...results: ReturnType<typeof trivyResult>[]) =>
  JSON.stringify({ runs: [{ results }] });

const braceExpansion = trivyResult('CVE-2026-102278', 'brace-expansion');
const lodash = trivyResult('CVE-2020-8203', 'lodash');

describe('compare-security-findings', () => {
  const originalArgv = process.argv;
  const originalSummary = process.env.GITHUB_STEP_SUMMARY;
  let dir: string;
  let errorSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'compare-security-findings-'));
    delete process.env.GITHUB_STEP_SUMMARY;
    jest.spyOn(process, 'exit').mockImplementation(code => {
      throw new ExitError(code as number | undefined);
    });
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    process.argv = originalArgv;
    if (originalSummary === undefined) {
      delete process.env.GITHUB_STEP_SUMMARY;
    } else {
      process.env.GITHUB_STEP_SUMMARY = originalSummary;
    }
    rmSync(dir, { force: true, recursive: true });
    jest.restoreAllMocks();
  });

  const writeReport = (name: string, contents: string): string => {
    const path = join(dir, name);
    writeFileSync(path, contents);
    return path;
  };

  /** Runs the script with the given arguments, returning the exit code it requested, if any. */
  const run = (...args: string[]): number | undefined => {
    process.argv = ['node', 'compare-security-findings.ts', ...args];
    try {
      jest.isolateModules(() => {
        require('./compare-security-findings');
      });
    } catch (error) {
      if (error instanceof ExitError) {
        return error.code;
      }
      throw error;
    }
    return undefined;
  };

  const report = (): string => logSpy.mock.calls[0][0];

  it('prints usage and exits 1 when given no arguments', () => {
    expect(run()).toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'usage: compare-security-findings.ts <tool>:<branch.sarif>:<staging.sarif> ...',
    );
  });

  it('exits 1 on an argument missing a report path', () => {
    expect(run('trivy-fs:branch.sarif')).toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(
      'Malformed argument: trivy-fs:branch.sarif',
    );
  });

  it('passes and lists a finding already on staging as not blocking', () => {
    const branch = writeReport('branch.sarif', sarif(braceExpansion));
    const staging = writeReport('staging.sarif', sarif(braceExpansion));

    expect(run(`trivy-fs:${branch}:${staging}`)).toBeUndefined();
    expect(report()).toContain('| trivy-fs | 1 | 1 | no change |');
    expect(report()).toContain(
      '**trivy-fs**: 1 already on staging, does not block this pull request',
    );
    expect(report()).not.toContain('blocks this pull request\n');
    expect(logSpy).toHaveBeenLastCalledWith(
      '\nNo security findings beyond those already on staging.',
    );
  });

  it('fails when the branch adds a finding, listing new findings before existing ones', () => {
    const branch = writeReport('branch.sarif', sarif(braceExpansion, lodash));
    const staging = writeReport('staging.sarif', sarif(braceExpansion));

    expect(run(`trivy-fs:${branch}:${staging}`)).toBe(1);
    const output = report();
    const table = output.indexOf('| trivy-fs | 1 | 2 | 1 new |');
    const added = output.indexOf('new on this branch, not on staging');
    const existing = output.indexOf('already on staging, does not block');
    expect(table).toBeGreaterThanOrEqual(0);
    expect(added).toBeGreaterThan(table);
    expect(existing).toBeGreaterThan(added);
    expect(errorSpy).toHaveBeenCalledWith(
      '\nERROR: this branch adds security findings that staging does not have.',
    );
  });

  it('writes the report to the job summary when GITHUB_STEP_SUMMARY is set', () => {
    const branch = writeReport('branch.sarif', sarif(lodash));
    const staging = writeReport('staging.sarif', sarif());
    const summary = writeReport('summary.md', '');
    process.env.GITHUB_STEP_SUMMARY = summary;

    run(`trivy-fs:${branch}:${staging}`);

    expect(readFileSync(summary, 'utf-8')).toBe(
      `### Security findings vs staging\n\n${report()}\n\n`,
    );
  });

  it('passes with a note when the staging report is missing', () => {
    const branch = writeReport('branch.sarif', sarif(lodash));

    expect(
      run(`trivy-fs:${branch}:${join(dir, 'missing.sarif')}`),
    ).toBeUndefined();
    expect(report()).toContain('no staging baseline to compare against');
  });
});
