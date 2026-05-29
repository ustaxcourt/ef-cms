jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  COVERAGE_HEADING,
  COVERAGE_PENDING_CELL,
  downloadCoverageSummaryArtifact,
  formatCoverageCell,
  getCoverageSummary,
  getCoverageSummaryArtifactName,
  readCoverageSummary,
  renderCoverageSection,
  replaceCoverageTableRow,
  summarizeCoverageReport,
  updatePullRequestCoverage,
  writeCoverageSummary,
  type CoverageSummary,
} from './suite-coverage.helpers';

describe('suite-coverage.helpers', () => {
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
  const mockedExecFileSync = jest.mocked(execFileSync);
  const originalFetch = global.fetch;
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'suite-coverage'));

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('formats a coverage cell with all four percentages', () => {
    expect(formatCoverageCell(apiCoverageSummary)).toBe(
      'branches: 90.12%<br />functions: 91.23%<br />lines: 92.34%<br />statements: 93.45%',
    );
  });

  it('renders a full coverage section with unavailable and pending placeholders', () => {
    expect(
      renderCoverageSection({
        beforeBySuite: {
          api: apiCoverageSummary,
          client: clientCoverageSummary,
        },
      }),
    ).toEqual([
      COVERAGE_HEADING,
      '',
      '| Suite | Before | After |',
      '| --- | --- | --- |',
      '| api | branches: 90.12%<br />functions: 91.23%<br />lines: 92.34%<br />statements: 93.45% | Pending |',
      '| client | branches: 94.56%<br />functions: 95.67%<br />lines: 96.78%<br />statements: 97.89% | Pending |',
      '| scripts | Not available | Pending |',
      '| shared | Not available | Pending |',
    ]);
  });

  it('renders provided after values even when before coverage is omitted', () => {
    expect(
      renderCoverageSection({
        afterBySuite: {
          api: apiCoverageSummary,
        },
      }),
    ).toEqual([
      COVERAGE_HEADING,
      '',
      '| Suite | Before | After |',
      '| --- | --- | --- |',
      `| api | Not available | ${formatCoverageCell(apiCoverageSummary)} |`,
      '| client | Not available | Pending |',
      '| scripts | Not available | Pending |',
      '| shared | Not available | Pending |',
    ]);
  });

  it('builds a stable artifact name for a suite and pull request', () => {
    expect(
      getCoverageSummaryArtifactName({
        pullRequestNumber: 4321,
        suite: 'shared',
      }),
    ).toBe('coverage-summary-shared-pr-4321');
  });

  it('converts Istanbul coverage-summary.json totals into the release summary format', () => {
    expect(
      summarizeCoverageReport({
        report: {
          total: {
            branches: { pct: 90.12 },
            functions: { pct: 91.23 },
            lines: { pct: 92.34 },
            statements: { pct: 93.45 },
          },
        },
        suite: 'api',
      }),
    ).toEqual(apiCoverageSummary);
  });

  it('writes and reads standardized coverage summary files', () => {
    const inputFilePath = path.join(tempDir, 'coverage-summary.json');
    const outputFilePath = path.join(tempDir, 'suite-coverage-summary.json');

    fs.writeFileSync(
      inputFilePath,
      JSON.stringify({
        total: {
          branches: { pct: 90.12 },
          functions: { pct: 91.23 },
          lines: { pct: 92.34 },
          statements: { pct: 93.45 },
        },
      }),
    );

    expect(
      writeCoverageSummary({
        inputFilePath,
        outputFilePath,
        suite: 'api',
      }),
    ).toEqual(apiCoverageSummary);
    expect(readCoverageSummary(outputFilePath)).toEqual(apiCoverageSummary);
  });

  it('replaces only the after cell for the matching suite row', () => {
    const body = [
      '### Includes',
      '',
      '### Coverage',
      '',
      '| Suite | Before | After |',
      '| --- | --- | --- |',
      '| api | branches: 80.00%<br />functions: 81.00%<br />lines: 82.00%<br />statements: 83.00% | Pending |',
      '| client | Not available | Pending |',
      '',
      '### Manual steps',
      '',
    ].join('\n');

    expect(
      replaceCoverageTableRow({
        body,
        summary: apiCoverageSummary,
      }),
    ).toContain(
      '| api | branches: 80.00%<br />functions: 81.00%<br />lines: 82.00%<br />statements: 83.00% | branches: 90.12%<br />functions: 91.23%<br />lines: 92.34%<br />statements: 93.45% |',
    );
  });

  it('leaves the body unchanged when the coverage section or row is absent', () => {
    const bodyWithoutCoverage = '### Includes\n\n### Manual steps\n';
    const bodyWithoutApiRow = [
      '### Coverage',
      '',
      '| Suite | Before | After |',
      '| --- | --- | --- |',
      '| client | Not available | Pending |',
    ].join('\n');

    expect(
      replaceCoverageTableRow({
        body: bodyWithoutCoverage,
        summary: apiCoverageSummary,
      }),
    ).toBe(bodyWithoutCoverage);
    expect(
      replaceCoverageTableRow({
        body: bodyWithoutApiRow,
        summary: apiCoverageSummary,
      }),
    ).toBe(bodyWithoutApiRow);
  });

  it('updates the pull request body when the matching coverage row exists', async () => {
    const fetchImplementation = jest
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            body: [
              COVERAGE_HEADING,
              '',
              '| Suite | Before | After |',
              '| --- | --- | --- |',
              '| api | Not available | Pending |',
            ].join('\n'),
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({ ok: true } as Response);

    await expect(
      updatePullRequestCoverage({
        fetchImplementation,
        pullRequestNumber: 4321,
        repository: 'ustaxcourt/ef-cms',
        summary: apiCoverageSummary,
        token: 'token',
      }),
    ).resolves.toBe(true);

    expect(fetchImplementation).toHaveBeenNthCalledWith(
      2,
      'https://api.github.com/repos/ustaxcourt/ef-cms/pulls/4321',
      expect.objectContaining({
        body: JSON.stringify({
          body: [
            COVERAGE_HEADING,
            '',
            '| Suite | Before | After |',
            '| --- | --- | --- |',
            `| api | Not available | ${formatCoverageCell(apiCoverageSummary)} |`,
          ].join('\n'),
        }),
        method: 'PATCH',
      }),
    );
  });

  it('does not patch the pull request when no applicable coverage row is present', async () => {
    const fetchImplementation = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({ body: '### Includes' }),
      ok: true,
    } as Response);

    await expect(
      updatePullRequestCoverage({
        fetchImplementation,
        pullRequestNumber: 4321,
        repository: 'ustaxcourt/ef-cms',
        summary: apiCoverageSummary,
        token: 'token',
      }),
    ).resolves.toBe(false);
    expect(fetchImplementation).toHaveBeenCalledTimes(1);
  });

  it('uses the default fetch implementation and normalizes an undefined PR body before patching', async () => {
    const originalFetch = global.fetch;

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () => Promise.resolve({ body: undefined }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({ ok: true } as Response);

    await expect(
      updatePullRequestCoverage({
        pullRequestNumber: 4321,
        repository: 'ustaxcourt/ef-cms',
        summary: apiCoverageSummary,
        token: 'token',
      }),
    ).resolves.toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(2);

    global.fetch = originalFetch;
  });

  it('throws helpful errors when reading or updating the pull request fails', async () => {
    const readFailureFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);
    const updateFailureFetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            body: [
              COVERAGE_HEADING,
              '',
              '| Suite | Before | After |',
              '| --- | --- | --- |',
              `| api | Not available | ${COVERAGE_PENDING_CELL} |`,
            ].join('\n'),
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 422,
      } as Response);

    await expect(
      updatePullRequestCoverage({
        fetchImplementation: readFailureFetch,
        pullRequestNumber: 4321,
        repository: 'ustaxcourt/ef-cms',
        summary: apiCoverageSummary,
        token: 'token',
      }),
    ).rejects.toThrow('Unable to read pull request #4321 (500)');

    await expect(
      updatePullRequestCoverage({
        fetchImplementation: updateFailureFetch,
        pullRequestNumber: 4321,
        repository: 'ustaxcourt/ef-cms',
        summary: apiCoverageSummary,
        token: 'token',
      }),
    ).rejects.toThrow('Unable to update pull request #4321 (422)');
  });

  it('downloads and parses a coverage summary artifact', async () => {
    mockedExecFileSync.mockImplementation(
      (command: string, args: readonly string[] = []) => {
        if (command === 'unzip') {
          const outputDirectory = args[3] as string;

          fs.writeFileSync(
            path.join(outputDirectory, 'coverage-summary.json'),
            JSON.stringify(apiCoverageSummary),
          );

          return Buffer.from('');
        }

        if (command === 'find') {
          return `${path.join(tempDir, 'coverage-summary.json')}\n`;
        }

        throw new Error(`Unexpected command: ${command}`);
      },
    );
    fs.writeFileSync(
      path.join(tempDir, 'coverage-summary.json'),
      JSON.stringify(apiCoverageSummary),
    );

    jest.mocked(global.fetch).mockResolvedValueOnce({
      arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
      ok: true,
    } as Response);

    await expect(
      downloadCoverageSummaryArtifact({
        artifact: {
          archive_download_url: 'https://example.com/coverage.zip',
          expired: false,
          name: 'coverage-summary-api-pr-5678',
        },
        token: 'token',
      }),
    ).resolves.toEqual(apiCoverageSummary);
  });

  it('throws when the artifact download fails', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 502,
    } as Response);

    await expect(
      downloadCoverageSummaryArtifact({
        artifact: {
          archive_download_url: 'https://example.com/coverage.zip',
          expired: false,
          name: 'coverage-summary-api-pr-5678',
        },
        token: 'token',
      }),
    ).rejects.toThrow(
      'Artifact download failed (502): https://example.com/coverage.zip',
    );
  });

  it('throws when the downloaded artifact does not contain exactly one json file', async () => {
    mockedExecFileSync.mockImplementation((command: string) => {
      if (command === 'unzip') {
        return Buffer.from('');
      }

      if (command === 'find') {
        return '';
      }

      throw new Error(`Unexpected command: ${command}`);
    });
    jest.mocked(global.fetch).mockResolvedValueOnce({
      arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
      ok: true,
    } as Response);

    await expect(
      downloadCoverageSummaryArtifact({
        artifact: {
          archive_download_url: 'https://example.com/coverage.zip',
          expired: false,
          name: 'coverage-summary-api-pr-5678',
        },
        token: 'token',
      }),
    ).rejects.toThrow(
      'Downloaded artifact must contain exactly one json coverage summary file, found 0',
    );
  });

  it('returns undefined when no matching artifact exists for the suite', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ artifacts: [] }),
      ok: true,
    } as Response);

    await expect(
      getCoverageSummary({
        pullRequestNumber: 5678,
        repository: 'ustaxcourt/ef-cms',
        suite: 'api',
        token: 'token',
      }),
    ).resolves.toBeUndefined();
  });

  it('throws when artifact lookup fails', async () => {
    jest.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response);

    await expect(
      getCoverageSummary({
        pullRequestNumber: 5678,
        repository: 'ustaxcourt/ef-cms',
        suite: 'api',
        token: 'token',
      }),
    ).rejects.toThrow(
      'GitHub artifact lookup failed (500): coverage-summary-api-pr-5678',
    );
  });
});
