jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
}));

import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  GhCliGitHubClient,
  type GitHubIssue,
  type GitHubPullRequest,
} from './github-client';
import type { CoverageSummary } from '../github-actions/suite-coverage.helpers';

describe('github-client', () => {
  const issue: GitHubIssue = {
    assignees: [{ login: 'dana' }, { login: 'alice' }],
    body: 'Describe the Bug\n\nThe thing broke.',
    labels: [{ name: 'bug' }],
    number: 1234,
  };
  const issueLinkedPullRequest: GitHubPullRequest = {
    author: { login: 'alice' },
    body: [
      'This ships a fix.',
      '',
      '```bash',
      'npm run deploy:account-specific',
      '```',
    ].join('\n'),
    commits: [
      {
        authors: [{ login: 'bob' }],
        messageHeadline: '1234: fix the regression',
      },
    ],
    labels: [],
    number: 5678,
    title: '1234 fix the regression',
  };
  const apiCoverageSummary: CoverageSummary = {
    branches: 90.12,
    functions: 91.23,
    lines: 92.34,
    statements: 93.45,
    suite: 'api',
  };
  const mockedExecFileSync = jest.mocked(execFileSync);
  const originalFetch = global.fetch;
  const tempDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'prod-release-pr-description-cli-'),
  );

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
    fs.rmSync(tempDir, { force: true, recursive: true });
  });

  it('calls gh with the expected commands and parses json responses', async () => {
    const commandRunner = jest
      .fn()
      .mockResolvedValueOnce(
        JSON.stringify([{ mergedAt: '2026-05-10T03:35:07Z', number: 5678 }]),
      )
      .mockResolvedValueOnce(JSON.stringify([{ number: 5678 }]))
      .mockResolvedValueOnce(JSON.stringify(issueLinkedPullRequest))
      .mockResolvedValueOnce(JSON.stringify(issue));
    const client = new GhCliGitHubClient({
      commandRunner,
    });

    await expect(client.getLatestProdPullRequest()).resolves.toEqual({
      mergedAt: '2026-05-10T03:35:07Z',
      number: 5678,
    });
    await expect(
      client.listMergedStagingPullRequests('2026-05-10T03:35:07Z'),
    ).resolves.toEqual([issueLinkedPullRequest]);
    await expect(client.getIssue(1234)).resolves.toEqual(issue);

    expect(commandRunner).toHaveBeenNthCalledWith(
      1,
      'gh',
      [
        'pr',
        'list',
        '--base',
        'prod',
        '--state',
        'merged',
        '--limit',
        '100',
        '--json',
        'mergedAt,number',
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    expect(commandRunner).toHaveBeenNthCalledWith(
      2,
      'gh',
      [
        'pr',
        'list',
        '--base',
        'staging',
        '--state',
        'merged',
        '--search',
        'merged:>2026-05-10T03:35:07Z',
        '--limit',
        '100',
        '--json',
        'number',
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    expect(commandRunner).toHaveBeenNthCalledWith(
      3,
      'gh',
      [
        'pr',
        'view',
        '5678',
        '--json',
        'author,body,commits,files,labels,number,title',
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    expect(commandRunner).toHaveBeenNthCalledWith(
      4,
      'gh',
      ['issue', 'view', '1234', '--json', 'assignees,body,labels,number'],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
  });

  it('throws a helpful error when there is no merged prod pull request to anchor the release window', async () => {
    const client = new GhCliGitHubClient({
      commandRunner: jest.fn().mockResolvedValue(JSON.stringify([])),
    });

    await expect(client.getLatestProdPullRequest()).rejects.toThrow(
      'Unable to determine the latest merged prod pull request timestamp.',
    );
  });

  it('selects the latest prod pull request by merge date when gh returns unsorted results', async () => {
    const client = new GhCliGitHubClient({
      commandRunner: jest.fn().mockResolvedValue(
        JSON.stringify([
          { mergedAt: '2026-05-10T03:35:07Z', number: 5678 },
          { mergedAt: '2026-05-20T03:35:07Z', number: 6789 },
          { mergedAt: '2026-05-15T03:35:07Z', number: 6123 },
        ]),
      ),
    });

    await expect(client.getLatestProdPullRequest()).resolves.toEqual({
      mergedAt: '2026-05-20T03:35:07Z',
      number: 6789,
    });
  });

  it('uses the default command runner when one is not provided', async () => {
    const runCommandModule = require('../helpers/runCommand') as {
      runCommand: (...args: unknown[]) => Promise<string>;
    };
    const runCommandSpy = jest.spyOn(runCommandModule, 'runCommand');

    runCommandSpy.mockResolvedValueOnce(
      JSON.stringify([{ mergedAt: '2026-05-10T03:35:07Z', number: 5678 }]),
    );

    const client = new GhCliGitHubClient();

    await expect(client.getLatestProdPullRequest()).resolves.toEqual({
      mergedAt: '2026-05-10T03:35:07Z',
      number: 5678,
    });

    runCommandSpy.mockRestore();
  });

  it('downloads and parses a stored coverage summary artifact for the requested suite', async () => {
    const commandRunner = jest
      .fn()
      .mockResolvedValueOnce(
        JSON.stringify({ nameWithOwner: 'ustaxcourt/ef-cms' }),
      )
      .mockResolvedValueOnce('gh-token');

    mockedExecFileSync.mockImplementation(
      (command: string, args: readonly string[] = []) => {
        if (command === 'unzip') {
          const outputDirectory = args[3] as string;

          fs.writeFileSync(
            path.join(outputDirectory, 'coverage-summary.json'),
            JSON.stringify(apiCoverageSummary),
          );
          fs.writeFileSync(
            path.join(tempDir, 'coverage-summary.json'),
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

    jest
      .mocked(global.fetch)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            artifacts: [
              {
                archive_download_url: 'https://example.com/coverage.zip',
                expired: false,
                name: 'coverage-summary-api-pr-5678',
              },
            ],
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
        ok: true,
      } as Response);

    const client = new GhCliGitHubClient({ commandRunner });

    await expect(client.getCoverageSummary(5678, 'api')).resolves.toEqual(
      apiCoverageSummary,
    );
    expect(commandRunner).toHaveBeenNthCalledWith(
      1,
      'gh',
      ['repo', 'view', '--json', 'nameWithOwner'],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    expect(commandRunner).toHaveBeenNthCalledWith(2, 'gh', ['auth', 'token'], {
      GH_PAGER: 'cat',
      PAGER: 'cat',
    });
  });

  it('returns undefined when no stored coverage summary artifact exists for the suite', async () => {
    const client = new GhCliGitHubClient({
      commandRunner: jest
        .fn()
        .mockResolvedValueOnce(
          JSON.stringify({ nameWithOwner: 'ustaxcourt/ef-cms' }),
        )
        .mockResolvedValueOnce('gh-token'),
    });

    jest.mocked(global.fetch).mockResolvedValueOnce({
      json: () => Promise.resolve({ artifacts: [] }),
      ok: true,
    } as Response);

    await expect(
      client.getCoverageSummary(5678, 'api'),
    ).resolves.toBeUndefined();
  });
});
