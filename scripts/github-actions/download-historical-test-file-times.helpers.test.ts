jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import {
  getAncestorCommitShas,
  downloadHistoricalTestFileTimes,
} from './download-historical-test-file-times.helpers';

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
      GITHUB_REPOSITORY: 'ustaxcourt/ef-cms',
      GITHUB_SHA: 'current',
      GITHUB_TOKEN: 'token',
    };
    // Ensure no GITHUB_RUN_ID leaks in from the test runner's environment —
    // tests that exercise the race-filter set it explicitly.
    delete process.env.GITHUB_RUN_ID;
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnvironment;
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  describe('getAncestorCommitShas', () => {
    it('returns current branch commits in descending order, including the current sha', () => {
      mockedExecFileSync.mockImplementation((command: string) => {
        if (command === 'git') {
          return 'current\nancestor-b\nancestor-a\n';
        }

        throw new Error(`Unexpected command: ${command}`);
      });

      expect(getAncestorCommitShas()).toEqual([
        'current',
        'ancestor-b',
        'ancestor-a',
      ]);
      expect(mockedExecFileSync).toHaveBeenCalledWith(
        'git',
        ['rev-list', '--max-count=501', 'HEAD'],
        {
          encoding: 'utf8',
        },
      );
    });
  });

  describe('main', () => {
    it('throws when required environment variables are missing', async () => {
      delete process.env.GITHUB_TOKEN;

      await expect(
        downloadHistoricalTestFileTimes({
          artifactName: 'historical-test-file-times',
          outputFilePath: path.join(tempDir, 'missing-env.json'),
          workflowFileName: 'client.yml',
        }),
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
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'client.yml-historical-test-file-times-ancestor',
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
        './example.test.ts': 1000,
      });
      expect(global.fetch).not.toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-current&per_page=1',
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-ancestor&per_page=1',
        expect.anything(),
      );
    });

    it('returns early when no matching artifact is found in any ancestor', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      mockedExecFileSync.mockReturnValue('current\nancestor-a\n');
      jest.mocked(global.fetch).mockResolvedValue({
        json: () =>
          Promise.resolve({
            artifacts: [],
          }),
        ok: true,
      } as Response);

      await downloadHistoricalTestFileTimes({
        artifactName: 'historical-test-file-times',
        outputFilePath: path.join(tempDir, 'missing-anywhere.json'),
        workflowFileName: 'client.yml',
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        'No successful ancestor workflow run with test timing artifact found.',
      );

      consoleSpy.mockRestore();
    });

    it('falls back to an older ancestor when a closer ancestor lacks a timing artifact', async () => {
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
              artifacts: [],
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
        outputFilePath: path.join(tempDir, 'fallback-artifact.json'),
        workflowFileName: 'client.yml',
      });

      expect(global.fetch).not.toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-current&per_page=1',
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-ancestor-b&per_page=1',
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-ancestor-a&per_page=1',
        expect.anything(),
      );
    });

    it('throws when artifact download fails', async () => {
      mockedExecFileSync.mockReturnValue('current\nancestor\n');
      jest
        .mocked(global.fetch)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'client.yml-historical-test-file-times-ancestor',
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
        downloadHistoricalTestFileTimes({
          artifactName: 'historical-test-file-times',
          outputFilePath: path.join(tempDir, 'artifact-download-error.json'),
          workflowFileName: 'client.yml',
        }),
      ).rejects.toThrow(
        'Artifact download failed (502): https://example.com/artifact.zip',
      );
    });

    it('throws when artifact lookup fails with non-retryable error', async () => {
      mockedExecFileSync.mockImplementation((command: string) => {
        if (command === 'git') {
          return 'current\nancestor\n';
        }
        return Buffer.from('');
      });
      jest.mocked(global.fetch).mockResolvedValueOnce({
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
        'GitHub API request failed (500): https://api.github.com/repos/ustaxcourt/ef-cms/actions/artifacts?name=client.yml-historical-test-file-times-ancestor&per_page=1',
      );
    });

    it('continues when artifact lookup fails with 403 or 404', async () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});

      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nancestor-c\nancestor-b\nancestor-a\n';
          }

          if (command === 'unzip') {
            const outputDirectory = args[3];

            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({
                './found.test.ts': 1000,
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
          ok: false,
          status: 403,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
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
        outputFilePath: path.join(tempDir, 'retry-403-404.json'),
        workflowFileName: 'client.yml',
      });

      expect(global.fetch).toHaveBeenCalledTimes(4);
      consoleSpy.mockRestore();
    });

    it('ignores expired artifacts', async () => {
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
                './found.test.ts': 1000,
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
              artifacts: [
                {
                  archive_download_url: 'https://example.com/expired.zip',
                  expired: true,
                  name: 'client.yml-historical-test-file-times-ancestor-b',
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
                  archive_download_url: 'https://example.com/valid.zip',
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
        outputFilePath: path.join(tempDir, 'ignore-expired.json'),
        workflowFileName: 'client.yml',
      });

      expect(global.fetch).toHaveBeenCalledTimes(3);
      consoleSpy.mockRestore();
    });
    it('skips both the current GITHUB_SHA and the merge commit SHA (HEAD)', async () => {
      const outputFilePath = path.join(tempDir, 'skip-both.json');

      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'merge-commit\ncurrent\nancestor\n';
          }

          if (command === 'unzip') {
            const outputDirectory = args[3];
            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({}),
            );
            return Buffer.from('');
          }

          throw new Error(`Unexpected command: ${command}`);
        },
      );

      jest.mocked(global.fetch).mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            artifacts: [
              {
                archive_download_url: 'https://example.com/artifact.zip',
                expired: false,
                name: 'client.yml-historical-test-file-times-ancestor',
              },
            ],
          }),
        ok: true,
      } as Response);
      jest.mocked(global.fetch).mockResolvedValueOnce({
        arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
        ok: true,
      } as Response);

      await downloadHistoricalTestFileTimes({
        artifactName: 'historical-test-file-times',
        outputFilePath,
        workflowFileName: 'client.yml',
      });

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('merge-commit'),
        expect.anything(),
      );
      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.stringContaining('current'),
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('ancestor'),
        expect.anything(),
      );
    });

    it('ignores artifacts created after the current workflow run started', async () => {
      // This guards against the matrix-shard race: parallel shards in the
      // same run must filter to the same artifact pool, even if one shard
      // queries the API after a fresh artifact has been uploaded.
      process.env.GITHUB_RUN_ID = '424242';

      const outputFilePath = path.join(tempDir, 'race-filter.json');
      const runStartedAt = '2026-05-14T16:00:00Z';
      const beforeRun = '2026-05-14T15:00:00Z';
      const afterRun = '2026-05-14T16:05:00Z';

      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nrecent\nolder\n';
          }
          if (command === 'unzip') {
            const outputDirectory = args[3];
            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({ './stable.test.ts': 1500 }),
            );
            return Buffer.from('');
          }
          throw new Error(`Unexpected command: ${command}`);
        },
      );

      jest
        .mocked(global.fetch)
        // workflow run lookup
        .mockResolvedValueOnce({
          json: () => Promise.resolve({ run_started_at: runStartedAt }),
          ok: true,
        } as Response)
        // recent ancestor's artifact: created AFTER this run started
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/racy.zip',
                  created_at: afterRun,
                  expired: false,
                  name: 'client.yml-historical-test-file-times-recent',
                },
              ],
            }),
          ok: true,
        } as Response)
        // older ancestor's artifact: created BEFORE this run started
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/stable.zip',
                  created_at: beforeRun,
                  expired: false,
                  name: 'client.yml-historical-test-file-times-older',
                },
              ],
            }),
          ok: true,
        } as Response)
        // artifact download
        .mockResolvedValueOnce({
          arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
          ok: true,
        } as Response);

      await downloadHistoricalTestFileTimes({
        artifactName: 'historical-test-file-times',
        outputFilePath,
        workflowFileName: 'client.yml',
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.github.com/repos/ustaxcourt/ef-cms/actions/runs/424242',
        expect.anything(),
      );
      expect(global.fetch).not.toHaveBeenCalledWith(
        'https://example.com/racy.zip',
        expect.anything(),
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://example.com/stable.zip',
        expect.anything(),
      );
      expect(JSON.parse(fs.readFileSync(outputFilePath, 'utf8'))).toEqual({
        './stable.test.ts': 1500,
      });
    });

    it('continues without the race-filter when the run lookup fails', async () => {
      process.env.GITHUB_RUN_ID = '424242';
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      const outputFilePath = path.join(tempDir, 'race-filter-fallback.json');

      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nancestor\n';
          }
          if (command === 'unzip') {
            const outputDirectory = args[3];
            fs.writeFileSync(
              path.join(outputDirectory, 'historical-test-file-times.json'),
              JSON.stringify({ './any.test.ts': 1 }),
            );
            return Buffer.from('');
          }
          throw new Error(`Unexpected command: ${command}`);
        },
      );

      jest
        .mocked(global.fetch)
        // workflow run lookup fails
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        } as Response)
        // artifact lookup succeeds without race filter
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/any.zip',
                  // created_at omitted; should still be accepted in fallback
                  expired: false,
                  name: 'client.yml-historical-test-file-times-ancestor',
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
        './any.test.ts': 1,
      });
      consoleSpy.mockRestore();
    });

    it('throws when the downloaded artifact contains no json timing files', async () => {
      mockedExecFileSync.mockImplementation((command: string) => {
        if (command === 'git') {
          return 'current\nancestor\n';
        }

        if (command === 'unzip') {
          return Buffer.from('');
        }

        throw new Error(`Unexpected command: ${command}`);
      });

      jest
        .mocked(global.fetch)
        .mockResolvedValueOnce({
          json: () =>
            Promise.resolve({
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'client.yml-historical-test-file-times-ancestor',
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
        downloadHistoricalTestFileTimes({
          artifactName: 'historical-test-file-times',
          outputFilePath: path.join(tempDir, 'no-json.json'),
          workflowFileName: 'client.yml',
        }),
      ).rejects.toThrow(
        'Downloaded artifact must contain exactly one json timing file, found 0',
      );
    });

    it('throws when the downloaded artifact contains multiple json timing files', async () => {
      mockedExecFileSync.mockImplementation(
        (command: string, args: readonly string[] = []) => {
          if (command === 'git') {
            return 'current\nancestor\n';
          }

          if (command === 'unzip') {
            const outputDirectory = args[3];

            fs.writeFileSync(
              path.join(outputDirectory, 'one.json'),
              JSON.stringify({}),
            );
            fs.writeFileSync(
              path.join(outputDirectory, 'two.json'),
              JSON.stringify({}),
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
              artifacts: [
                {
                  archive_download_url: 'https://example.com/artifact.zip',
                  expired: false,
                  name: 'client.yml-historical-test-file-times-ancestor',
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
        downloadHistoricalTestFileTimes({
          artifactName: 'historical-test-file-times',
          outputFilePath: path.join(tempDir, 'multiple-json.json'),
          workflowFileName: 'client.yml',
        }),
      ).rejects.toThrow(
        'Downloaded artifact must contain exactly one json timing file, found 2',
      );
    });
  });
});
