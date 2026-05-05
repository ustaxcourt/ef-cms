import fs from 'fs';
import os from 'os';
import path from 'path';

jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import { execFileSync } from 'child_process';
import {
  findClosestAncestorWorkflowRun,
  getAncestorCommitShas,
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

  describe('getAncestorCommitShas', () => {
    it('returns current branch commits in descending order, excluding the current sha', () => {
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

      expect(
        getAncestorCommitShas({
          currentSha: 'current',
        }),
      ).toEqual(['ancestor-b', 'ancestor-a']);
    });
  });

  describe('findClosestAncestorWorkflowRun', () => {
    it('returns the closest successful ancestor run based on local commit order', () => {
      expect(
        findClosestAncestorWorkflowRun({
          ancestorCommitShas: ['ancestor-b', 'ancestor-a'],
          workflowRuns: [
            {
              conclusion: 'success',
              head_sha: 'ancestor-a',
              id: 2,
            },
            {
              conclusion: 'success',
              head_sha: 'ancestor-b',
              id: 1,
            },
          ],
        }),
      ).toEqual({
        conclusion: 'success',
        head_sha: 'ancestor-b',
        id: 1,
      });
    });

    it('returns undefined when no successful ancestor exists', () => {
      expect(
        findClosestAncestorWorkflowRun({
          ancestorCommitShas: ['ancestor-a'],
          workflowRuns: [
            {
              conclusion: 'failure',
              head_sha: 'ancestor-a',
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
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nancestor\n';
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
                  name: 'historical-test-file-times-ancestor',
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

    it('falls back to the legacy generic artifact name for compatibility', async () => {
      const outputFilePath = path.join(tempDir, 'legacy-downloaded.json');

      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nancestor\n';
          }

          if (command === 'unzip') {
            const outputDirectory = args[3];

            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({
                './legacy.test.ts': 1500,
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
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url:
                    'https://example.com/legacy-artifact.zip',
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
        './legacy.test.ts': 1500,
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
        'GitHub API request failed (500): https://api.github.com/repos/ustaxcourt/ef-cms/actions/workflows/client.yml/runs?status=completed&per_page=100&page=1',
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

    it('falls back to an older ancestor when a closer ancestor lacks a timing artifact', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
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
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/missing.zip',
                  expired: false,
                  name: 'something-else',
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
                  archive_download_url: 'https://example.com/found.zip',
                  expired: false,
                  name: 'historical-test-file-times-ancestor-a',
                },
              ],
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
          ok: true,
        } as Response);

      await main([
        'client.yml',
        'historical-test-file-times',
        path.join(tempDir, 'fallback-artifact.json'),
      ]);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('returns early when no ancestor timing artifact is available in any candidate run', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
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
          json: () =>
            Promise.resolve({
              artifacts: [],
            }),
          ok: true,
        } as Response)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              workflow_runs: [],
            }),
          ok: true,
        } as Response);

      await main([
        'client.yml',
        'historical-test-file-times',
        path.join(tempDir, 'missing-artifact.json'),
      ]);

      expect(consoleSpy).toHaveBeenCalledWith(
        'No successful ancestor workflow run with test timing artifact found.',
      );

      consoleSpy.mockRestore();
    });

    it('throws when artifact download fails', async () => {
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
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'historical-test-file-times-ancestor',
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
          return command === 'git' ? 'current\nancestor\n' : Buffer.from('');
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
                  name: 'historical-test-file-times-ancestor',
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
        'Downloaded artifact must contain exactly one json timing file, found 0',
      );
    });

    it('throws when the artifact zip contains multiple json files', async () => {
      const outputFilePath = path.join(tempDir, 'multiple-json.json');

      mockedExecFileSync.mockImplementation((command: string, args = []) => {
        if (command === 'git') {
          return 'current\nancestor\n';
        }

        if (command === 'unzip') {
          const outputDirectory = args[3];

          fs.writeFileSync(
            path.join(outputDirectory, 'historical-test-file-times.json'),
            JSON.stringify({ './example.test.ts': 1000 }),
          );
          fs.writeFileSync(
            path.join(outputDirectory, 'extra.json'),
            JSON.stringify({ './other.test.ts': 2000 }),
          );

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
                  name: 'historical-test-file-times-ancestor',
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
        'Downloaded artifact must contain exactly one json timing file, found 2',
      );
    });

    it('throws when workflow run pagination exceeds the safety limit', async () => {
      mockedExecFileSync.mockReturnValue('current\nancestor\n');

      for (let page = 0; page < 50; page += 1) {
        jest.mocked(global.fetch).mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              workflow_runs: [
                {
                  conclusion: 'failure',
                  head_sha: 'ancestor',
                  id: 123,
                },
              ],
            }),
          ok: true,
        } as Response);
      }

      await expect(
        main([
          'client.yml',
          'historical-test-file-times',
          path.join(tempDir, 'page-limit.json'),
        ]),
      ).rejects.toThrow(
        'Exceeded workflow run pagination limit (50 pages) while searching for historical test timings.',
      );
    });
  });
});
