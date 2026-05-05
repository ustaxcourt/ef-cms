import fs from 'fs';
import os from 'os';
import path from 'path';

jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import { execFileSync } from 'child_process';
import {
  findClosestAncestorWorkflowRun,
  isGitAncestor,
  main,
} from './download-historical-test-file-times';

describe('download-historical-test-file-times', () => {
  const mockedExecFileSync = jest.mocked(execFileSync);
  const originalEnvironment = process.env;
  const originalFetch = global.fetch;
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'download-historical-test-file-times-'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnvironment,
      GITHUB_HEAD_REF: 'feature-branch',
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

  describe('isGitAncestor', () => {
    it('returns true when git merge-base succeeds', () => {
      mockedExecFileSync.mockReturnValue(Buffer.from(''));

      expect(
        isGitAncestor({
          ancestorSha: 'ancestor',
          descendantSha: 'descendant',
        }),
      ).toBe(true);
    });

    it('returns false when git merge-base fails', () => {
      mockedExecFileSync.mockImplementation(() => {
        throw new Error('not ancestor');
      });

      expect(
        isGitAncestor({
          ancestorSha: 'ancestor',
          descendantSha: 'descendant',
        }),
      ).toBe(false);
    });
  });

  describe('findClosestAncestorWorkflowRun', () => {
    it('returns the first successful ancestor run', () => {
      expect(
        findClosestAncestorWorkflowRun({
          currentSha: 'current',
          isAncestor: ({ ancestorSha }: { ancestorSha: string }) =>
            ancestorSha === 'ancestor-a',
          workflowRuns: [
            {
              conclusion: 'failure',
              head_sha: 'ancestor-b',
              id: 2,
            },
            {
              conclusion: 'success',
              head_sha: 'ancestor-a',
              id: 1,
            },
          ],
        }),
      ).toEqual({
        conclusion: 'success',
        head_sha: 'ancestor-a',
        id: 1,
      });
    });

    it('returns undefined when no successful ancestor exists', () => {
      expect(
        findClosestAncestorWorkflowRun({
          currentSha: 'current',
          isAncestor: () => false,
          workflowRuns: [
            {
              conclusion: 'success',
              head_sha: 'current',
              id: 2,
            },
          ],
        }),
      ).toBeUndefined();
    });
  });

  describe('main', () => {
    it('throws when required arguments are missing', async () => {
      await expect(main([])).rejects.toThrow(
        'Usage: npx ts-node scripts/github-actions/download-historical-test-file-times.ts <workflow-file-name> <artifact-name> <output-path>',
      );
    });

    it('throws when required environment variables are missing', async () => {
      delete process.env.GITHUB_TOKEN;

      await expect(
        main([
          'client.yml',
          'historical-test-file-times',
          path.join(tempDir, 'missing-env.json'),
        ]),
      ).rejects.toThrow('Missing required environment variable: GITHUB_TOKEN');
    });

    it('downloads the matching ancestor artifact when one is available', async () => {
      const outputFilePath = path.join(tempDir, 'downloaded.json');

      mockedExecFileSync.mockImplementation(
        (command: string, args: string[]) => {
          if (command === 'git') {
            return Buffer.from('');
          }

          if (command === 'unzip') {
            const outputDirectory = args[3];

            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({
                './example.test.ts': 1000,
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
                  head_sha: 'ancestor',
                  id: 123,
                },
              ],
              ok: true,
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'historical-test-file-times',
                },
              ],
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
          ok: true,
        } as Response);

      await main(['client.yml', 'historical-test-file-times', outputFilePath]);

      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './example.test.ts': 1000,
      });
    });

    it('throws when the workflow runs request fails', async () => {
      jest.mocked(global.fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(
        main([
          'client.yml',
          'historical-test-file-times',
          path.join(tempDir, 'workflow-error.json'),
        ]),
      ).rejects.toThrow(
        'GitHub API request failed (500): https://api.github.com/repos/ustaxcourt/ef-cms/actions/workflows/client.yml/runs?branch=feature-branch&event=pull_request&status=completed&per_page=100',
      );
    });

    it('returns early when no ancestor run is found', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      jest.mocked(global.fetch).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            workflow_runs: [],
          }),
        ok: true,
      } as Response);

      await main([
        'client.yml',
        'historical-test-file-times',
        path.join(tempDir, 'missing.json'),
      ]);

      expect(consoleSpy).toHaveBeenCalledWith(
        'No successful ancestor workflow run with test timing artifact found.',
      );

      consoleSpy.mockRestore();
    });

    it('returns early when ancestor artifact is missing', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      mockedExecFileSync.mockReturnValue(Buffer.from(''));
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
          json: () =>
            Promise.resolve({
              artifacts: [],
            }),
          ok: true,
        } as Response);

      await main([
        'client.yml',
        'historical-test-file-times',
        path.join(tempDir, 'missing-artifact.json'),
      ]);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Ancestor workflow run did not include the expected timing artifact.',
      );

      consoleSpy.mockRestore();
    });

    it('throws when artifact download fails', async () => {
      mockedExecFileSync.mockReturnValue(Buffer.from(''));
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
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'historical-test-file-times',
                },
              ],
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
        } as Response);

      await expect(
        main([
          'client.yml',
          'historical-test-file-times',
          path.join(tempDir, 'artifact-download-error.json'),
        ]),
      ).rejects.toThrow(
        'Artifact download failed (502): https://example.com/artifact.zip',
      );
    });

    it('throws when the artifact zip does not contain a json file', async () => {
      const outputFilePath = path.join(tempDir, 'missing-json.json');

      mockedExecFileSync.mockImplementation((command: string) => {
        if (command === 'git' || command === 'unzip') {
          return Buffer.from('');
        }

        throw new Error(`Unexpected command: ${command}`);
      });

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
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'historical-test-file-times',
                },
              ],
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
          ok: true,
        } as Response);

      await expect(
        main(['client.yml', 'historical-test-file-times', outputFilePath]),
      ).rejects.toThrow(
        'Downloaded artifact did not contain a json timing file',
      );
    });
  });
});
