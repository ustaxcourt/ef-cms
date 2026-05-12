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
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = originalEnvironment;
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  describe('getAncestorCommitShas', () => {
    it('returns current branch commits in descending order, excluding the current sha', () => {
      mockedExecFileSync.mockImplementation((command: string) => {
        if (command === 'git') {
          return 'current\nancestor-b\nancestor-a\n';
        }

        throw new Error(`Unexpected command: ${command}`);
      });

      expect(
        getAncestorCommitShas({
          currentSha: 'current',
        }),
      ).toEqual(['ancestor-b', 'ancestor-a']);
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
      mockedExecFileSync.mockReturnValue('current\nancestor\n');
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
