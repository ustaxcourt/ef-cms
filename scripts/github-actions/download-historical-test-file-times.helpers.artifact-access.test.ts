jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { downloadHistoricalTestFileTimes } from './download-historical-test-file-times.helpers';

describe('download-historical-test-file-times artifact access', () => {
  const mockedExecFileSync = jest.mocked(execFileSync);
  const originalEnvironment = process.env;
  const originalFetch = global.fetch;
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'download-historical-test-file-times-artifacts-'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnvironment,
      GITHUB_REPOSITORY: 'ustaxcourt/ef-cms',
      GITHUB_SHA: 'current',
      GITHUB_TOKEN: 'token',
    };
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnvironment;
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('falls back to an older ancestor when artifact lookup for a closer ancestor is forbidden', async () => {
    const outputFilePath = path.join(tempDir, 'artifact-lookup-forbidden.json');
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    mockedExecFileSync.mockImplementation(
      (command: string, args: readonly string[] = []) => {
        if (command === 'git') {
          return 'current\nancestor-b\nancestor-a\n';
        }

        if (command === 'unzip') {
          const outputDirectory = args[3];

          fs.writeFileSync(
            path.join(outputDirectory, 'historical-test-file-times.json'),
            JSON.stringify({
              './fallback.test.ts': 2000,
            }),
          );

          return Buffer.from('');
        }

        throw new Error(`Unexpected command: ${command}`);
      },
    );

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [
              {
                conclusion: 'success',
                head_sha: 'ancestor-a',
                id: 123,
              },
              {
                conclusion: 'success',
                head_sha: 'ancestor-b',
                id: 456,
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            artifacts: [
              {
                archive_download_url: 'https://example.com/found.zip',
                expired: false,
                name: 'client.yml-historical-test-file-times-ancestor-a',
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
        ok: true,
      } as Response);

    await downloadHistoricalTestFileTimes({
      artifactName: 'historical-test-file-times',
      outputFilePath,
      workflowFileName: 'client.yml',
    });

    expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
      './fallback.test.ts': 2000,
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping historical timing artifact lookup for workflow run 456 (ancestor-b) because GitHub returned 403; continuing to older ancestor runs.',
    );

    consoleWarnSpy.mockRestore();
  });

  it('returns early when artifact lookup is forbidden for every candidate ancestor run', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    mockedExecFileSync.mockReturnValue('current\nancestor\n');
    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [
              {
                conclusion: 'success',
                head_sha: 'ancestor',
                id: 123,
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [],
          }),
        ok: true,
      } as Response);

    await downloadHistoricalTestFileTimes({
      artifactName: 'historical-test-file-times',
      outputFilePath: path.join(tempDir, 'artifact-forbidden-no-match.json'),
      workflowFileName: 'client.yml',
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'No successful ancestor workflow run with test timing artifact found.',
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping historical timing artifact lookup for workflow run 123 (ancestor) because GitHub returned 403; continuing to older ancestor runs.',
    );

    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('warns and continues when artifact lookup returns not found', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleWarnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});

    mockedExecFileSync.mockReturnValue('current\nancestor\n');
    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [
              {
                conclusion: 'success',
                head_sha: 'ancestor',
                id: 123,
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [],
          }),
        ok: true,
      } as Response);

    await downloadHistoricalTestFileTimes({
      artifactName: 'historical-test-file-times',
      outputFilePath: path.join(tempDir, 'artifact-not-found-no-match.json'),
      workflowFileName: 'client.yml',
    });

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping historical timing artifact lookup for workflow run 123 (ancestor) because GitHub returned 404; continuing to older ancestor runs.',
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'No successful ancestor workflow run with test timing artifact found.',
    );

    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('throws when artifact lookup fails unexpectedly', async () => {
    mockedExecFileSync.mockReturnValue('current\nancestor\n');
    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [
              {
                conclusion: 'success',
                head_sha: 'ancestor',
                id: 123,
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

    await expect(
      downloadHistoricalTestFileTimes({
        artifactName: 'historical-test-file-times',
        outputFilePath: path.join(tempDir, 'artifact-lookup-error.json'),
        workflowFileName: 'client.yml',
      }),
    ).rejects.toThrow(
      'GitHub API request failed (500): https://api.github.com/repos/ustaxcourt/ef-cms/actions/runs/123/artifacts',
    );
  });
});
