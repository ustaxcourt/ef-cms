/* eslint-disable max-lines */
import {
  extractBashCodeBlocks,
  extractDockerImageTag,
  extractIssueNumberFromTitle,
  enrichPullRequest,
  generateProdReleasePrDescription,
  prodReleasePrDescription,
  renderPrDescription,
  resolveOtherContributors,
  resolveTicketTask,
  resolveType,
} from './prod-release-pr-description.helpers';
import type { CoverageSummary } from '../github-actions/suite-coverage.helpers';
import type {
  GitHubClient,
  GitHubIssue,
  GitHubPullRequest,
} from './github-client';

describe('prod-release-pr-description', () => {
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
      '',
      '```bash',
      'npm run ecr:check-version',
      '```',
    ].join('\n'),
    commits: [
      {
        authors: [{ login: 'bob' }],
        messageHeadline: '1234: fix the regression',
      },
      {
        authors: [{ login: 'alice' }],
        messageHeadline: '1234: add test coverage',
      },
      {
        authors: [{ login: 'charlie' }],
        messageHeadline: "Merge branch 'staging' into 1234-fix-the-regression",
      },
      {
        authors: [{ login: 'bob' }],
        messageHeadline: '1234: polish copy',
      },
    ],
    labels: [],
    number: 5678,
    title: '1234 fix the regression',
  };
  const dependencyPullRequest: GitHubPullRequest = {
    author: { login: 'maintainer' },
    body: 'Routine update with no manual steps.',
    commits: [
      {
        authors: [{ login: 'reviewer' }],
        messageHeadline: 'chore: update dependencies',
      },
    ],
    labels: [],
    number: 6789,
    title: 'deps: weekly dependency updates',
  };
  const dockerDependencyPullRequest: GitHubPullRequest = {
    author: { login: 'maintainer' },
    body: 'Routine update with no manual steps.',
    commits: [
      {
        authors: [{ login: 'reviewer' }, { login: 'app/copilot-swe-agent' }],
        messageHeadline: 'chore: update dependencies',
      },
    ],
    files: [{ path: 'Dockerfile' }],
    labels: [],
    number: 6792,
    title: 'dependencies 05-01-2026',
  };
  const blankPullRequest: GitHubPullRequest = {
    author: { login: 'solo' },
    body: 'No special formatting here.',
    commits: [
      {
        authors: [{ login: 'solo' }],
        messageHeadline: 'misc cleanup',
      },
    ],
    labels: [],
    number: 6790,
    title: 'misc cleanup',
  };
  const namedContributorPullRequest: GitHubPullRequest = {
    author: null,
    body: [
      'Manual change required.',
      '',
      '```bash',
      'npm run deploy:blue',
      '```',
    ].join('\n'),
    commits: [
      {
        authors: [{ name: 'Casey Contributor' }],
        messageHeadline: 'ops: deploy blue',
      },
    ],
    labels: [{ name: 'bugfix' }],
    number: 6791,
    title: '5555 follow-up cleanup',
  };
  const secondIssueLinkedPullRequest: GitHubPullRequest = {
    author: { login: 'zoe' },
    body: 'Follow-up fix with no manual steps.',
    commits: [
      {
        authors: [{ login: 'sam' }, { login: 'Copilot' }],
        messageHeadline: '1234: follow-up fix',
      },
    ],
    labels: [],
    number: 5680,
    title: '1234 fix the regression more',
  };
  const circleConfig =
    'efcms-docker-image: &efcms-docker-image $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/ef-cms-us-east-1:4.3.80\n';
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

  describe('extractIssueNumberFromTitle', () => {
    it('returns an issue number when the title starts with digits', () => {
      expect(extractIssueNumberFromTitle('1234 fix the bug')).toBe(1234);
    });

    it('returns undefined when the title does not start with an issue number', () => {
      expect(
        extractIssueNumberFromTitle('devex: update script'),
      ).toBeUndefined();
    });
  });

  describe('resolveTicketTask', () => {
    it('resolves issues, dependencies, devex, and opex in the requested order', () => {
      expect(resolveTicketTask('1234 fix the bug')).toBe('#1234');
      expect(resolveTicketTask('deps: weekly dependency updates')).toBe(
        'dependencies',
      );
      expect(resolveTicketTask('devex: update script')).toBe('devex');
      expect(resolveTicketTask('opex: rotate alarms')).toBe('opex');
      expect(resolveTicketTask('misc cleanup')).toBe('');
    });
  });

  describe('resolveType', () => {
    it('returns repeated special types before checking issue metadata', () => {
      expect(
        resolveType({
          pullRequest: dependencyPullRequest,
          ticketTask: 'dependencies',
        }),
      ).toBe('dependencies');
    });

    it('classifies issue-backed pull requests as bugfixes when the issue is a bug', () => {
      expect(
        resolveType({
          issue,
          pullRequest: issueLinkedPullRequest,
          ticketTask: '#1234',
        }),
      ).toBe('bugfix');
    });

    it('classifies other issue-backed pull requests as stories', () => {
      expect(
        resolveType({
          issue: {
            assignees: [],
            body: 'Describe the change',
            labels: [{ name: 'enhancement' }],
            number: 4444,
          },
          pullRequest: issueLinkedPullRequest,
          ticketTask: '#4444',
        }),
      ).toBe('story');
    });

    it('classifies issue-backed pull requests as bugfixes when the pull request carries the bugfix label', () => {
      expect(
        resolveType({
          issue: {
            assignees: [],
            body: 'Describe the change',
            labels: [{ name: 'enhancement' }],
            number: 5555,
          },
          pullRequest: namedContributorPullRequest,
          ticketTask: '#5555',
        }),
      ).toBe('bugfix');
    });

    it('leaves the type blank when there is no recognized task type or issue', () => {
      expect(
        resolveType({
          pullRequest: blankPullRequest,
          ticketTask: '',
        }),
      ).toBe('');
    });
  });

  describe('extractBashCodeBlocks', () => {
    it('returns only bash code blocks and trims their contents', () => {
      expect(extractBashCodeBlocks(issueLinkedPullRequest.body)).toEqual([
        'npm run deploy:account-specific',
        'npm run ecr:check-version',
      ]);
    });

    it('returns an empty array when there are no bash code blocks', () => {
      expect(extractBashCodeBlocks('```text\nignore me\n```')).toEqual([]);
    });

    it('ignores empty bash code blocks after trimming', () => {
      expect(extractBashCodeBlocks('```bash\n   \n```')).toEqual([]);
    });
  });

  describe('extractDockerImageTag', () => {
    it('returns the docker image tag from the circle config file', () => {
      expect(extractDockerImageTag(circleConfig)).toBe('4.3.80');
    });

    it('returns undefined when the docker image tag is not present', () => {
      expect(extractDockerImageTag('version: 2.1\n')).toBeUndefined();
    });
  });

  describe('resolveOtherContributors', () => {
    it('combines issue assignees with non-merge commit authors, excludes the pr author, and de-duplicates contributors', () => {
      expect(
        resolveOtherContributors({
          issue,
          pullRequest: issueLinkedPullRequest,
        }),
      ).toBe('@dana<br />@bob');
    });

    it('returns a blank string when no other contributors exist', () => {
      expect(
        resolveOtherContributors({
          pullRequest: blankPullRequest,
        }),
      ).toBe('');
    });

    it('falls back to contributor names when commit authors do not have logins', () => {
      expect(
        resolveOtherContributors({
          issue: {
            assignees: [{ name: 'Jordan Assignee' }],
            body: 'Describe the Bug',
            labels: [{ name: 'bug' }],
            number: 5555,
          },
          pullRequest: namedContributorPullRequest,
        }),
      ).toBe('Jordan Assignee<br />Casey Contributor');
    });

    it('ignores empty contributor values while deduplicating', () => {
      expect(
        resolveOtherContributors({
          issue: {
            assignees: [{ login: '' }, { name: '  ' }],
            body: 'Describe the Bug',
            labels: [{ name: 'bug' }],
            number: 5555,
          },
          pullRequest: {
            ...namedContributorPullRequest,
            commits: [
              {
                authors: [{ login: '' }, { name: 'Taylor Teammate' }],
                messageHeadline: 'ops: deploy blue',
              },
            ],
          },
        }),
      ).toBe('Taylor Teammate');
    });

    it('excludes Copilot contributors in any capitalization or login format', () => {
      expect(
        resolveOtherContributors({
          issue: {
            assignees: [{ login: 'Copilot' }, { login: 'dana' }],
            body: 'Describe the Bug',
            labels: [{ name: 'bug' }],
            number: 1234,
          },
          pullRequest: {
            ...issueLinkedPullRequest,
            commits: [
              {
                authors: [{ login: 'app/copilot-swe-agent' }, { login: 'bob' }],
                messageHeadline: '1234: fix the regression',
              },
            ],
          },
        }),
      ).toBe('@dana<br />@bob');
    });
  });

  describe('renderPrDescription', () => {
    it('renders grouped markdown rows and checkbox-style manual steps', () => {
      const description = renderPrDescription({
        beforeCoverageBySuite: {
          api: apiCoverageSummary,
          client: clientCoverageSummary,
        },
        enrichedPullRequests: [
          {
            issue,
            manualSteps: [
              {
                command: 'npm run deploy:account-specific',
                description: 'Deploy account-specific terraform',
              },
            ],
            otherContributors: ['@dana', '@bob'],
            pullRequest: issueLinkedPullRequest,
            ticketTask: '#1234',
            type: 'bugfix',
          },
          {
            issue,
            manualSteps: [],
            otherContributors: ['@sam'],
            pullRequest: secondIssueLinkedPullRequest,
            ticketTask: '#1234',
            type: 'bugfix',
          },
        ],
      });

      expect(description).toContain(
        '| #1234 | bugfix | @dana<br />@bob<br />@sam | @alice #5678<br />@zoe #5680 |',
      );
      expect(description).toContain('### Manual steps');
      expect(description).toContain('### Coverage');
      expect(description).toContain(
        '| api | branches: 90.12%<br />functions: 91.23%<br />lines: 92.34%<br />statements: 93.45% | Pending |',
      );
      expect(description).toContain(
        [
          '- [ ] Deploy account-specific terraform',
          '   ```bash',
          '   npm run deploy:account-specific',
          '   ```',
        ].join('\n'),
      );
      expect(description).not.toContain('#### #5678 1234 fix the regression');
    });

    it('renders an empty manual-steps section when there are no bash blocks to include', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            manualSteps: [],
            otherContributors: [],
            pullRequest: {
              ...blankPullRequest,
              author: null,
            },
            ticketTask: '',
            type: '',
          },
        ],
      });

      expect(description).toBe(
        [
          '### Includes',
          '',
          '| Ticket/Task | Type | Other Contributors | PR Made By |',
          '| --- | --- | --- | --- |',
          '|  |  |  | #6790 |',
          '',
          '',
          '### Coverage',
          '',
          '| Suite | Before | After |',
          '| --- | --- | --- |',
          '| api | Not available | Pending |',
          '| client | Not available | Pending |',
          '| scripts | Not available | Pending |',
          '| shared | Not available | Pending |',
          '',
          '',
          '### Manual steps',
          '',
        ].join('\n'),
      );
    });

    it('separates multiple pull requests with manual steps by a blank line', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            issue,
            manualSteps: [
              {
                command: 'npm run deploy:account-specific',
                description: 'Deploy account-specific terraform',
              },
              {
                command: 'npm run ecr:check-version',
                description: 'docker container `4.3.80`',
              },
            ],
            otherContributors: ['@dana', '@bob'],
            pullRequest: issueLinkedPullRequest,
            ticketTask: '#1234',
            type: 'bugfix',
          },
          {
            issue: {
              assignees: [],
              body: 'Describe the change',
              labels: [{ name: 'enhancement' }],
              number: 5555,
            },
            manualSteps: [
              {
                command: 'npm run deploy:blue',
                description: 'Manual step',
              },
            ],
            otherContributors: ['Casey Contributor'],
            pullRequest: namedContributorPullRequest,
            ticketTask: '#5555',
            type: 'bugfix',
          },
        ],
      });

      expect(description).toContain(
        [
          '   ```bash',
          '   npm run ecr:check-version',
          '   ```',
          '',
          '- [ ] Manual step',
        ].join('\n'),
      );
    });

    it('deduplicates identical manual step commands across pull requests', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            manualSteps: [
              {
                command: 'npm run ecr:check-version',
                description: 'docker container `4.3.80`',
              },
            ],
            otherContributors: [],
            pullRequest: dependencyPullRequest,
            ticketTask: 'dependencies',
            type: 'dependencies',
          },
          {
            manualSteps: [
              {
                command: 'npm run ecr:check-version',
                description: 'docker container `4.3.80`',
              },
            ],
            otherContributors: [],
            pullRequest: dockerDependencyPullRequest,
            ticketTask: 'dependencies',
            type: 'dependencies',
          },
        ],
      });

      expect(description.match(/npm run ecr:check-version/g)).toHaveLength(1);
    });

    it('does not collapse non-issue task types like devex or dependencies into one row', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            manualSteps: [],
            otherContributors: [],
            pullRequest: {
              ...dependencyPullRequest,
              number: 7001,
            },
            ticketTask: 'dependencies',
            type: 'dependencies',
          },
          {
            manualSteps: [],
            otherContributors: [],
            pullRequest: {
              ...dockerDependencyPullRequest,
              number: 7002,
            },
            ticketTask: 'dependencies',
            type: 'dependencies',
          },
          {
            manualSteps: [],
            otherContributors: [],
            pullRequest: {
              ...blankPullRequest,
              number: 7003,
              title: 'devex: update script',
            },
            ticketTask: 'devex',
            type: 'devex',
          },
          {
            manualSteps: [],
            otherContributors: [],
            pullRequest: {
              ...blankPullRequest,
              number: 7004,
              title: 'devex: update another script',
            },
            ticketTask: 'devex',
            type: 'devex',
          },
        ],
      });

      expect(description).toContain(
        '| dependencies | dependencies |  | @maintainer #7001 |',
      );
      expect(description).toContain(
        '| dependencies | dependencies |  | @maintainer #7002 |',
      );
      expect(description).toContain('| devex | devex |  | @solo #7003 |');
      expect(description).toContain('| devex | devex |  | @solo #7004 |');
    });
  });

  describe('generateProdReleasePrDescription', () => {
    it('loads the latest prod merge timestamp, fetches merged staging pull requests, hydrates issues once, collapses matching issue rows, and returns the rendered comment', async () => {
      const githubClient: GitHubClient = {
        getCoverageSummary: jest
          .fn()
          .mockImplementation((pullRequestNumber: number, suite: string) => {
            expect(pullRequestNumber).toBe(4321);

            if (suite === 'api') {
              return apiCoverageSummary;
            }

            if (suite === 'client') {
              return clientCoverageSummary;
            }

            return undefined;
          }),
        getIssue: jest.fn().mockResolvedValue(issue),
        getLatestProdPullRequest: jest.fn().mockResolvedValue({
          mergedAt: '2026-05-10T03:35:07Z',
          number: 4321,
        }),
        getPullRequest: jest.fn(),
        listMergedStagingPullRequests: jest
          .fn()
          .mockResolvedValue([
            issueLinkedPullRequest,
            secondIssueLinkedPullRequest,
            dockerDependencyPullRequest,
            blankPullRequest,
          ]),
      };

      const description = await generateProdReleasePrDescription({
        circleConfig,
        githubClient,
      });

      expect(githubClient.getLatestProdPullRequest).toHaveBeenCalledTimes(1);
      expect(githubClient.listMergedStagingPullRequests).toHaveBeenCalledWith(
        '2026-05-10T03:35:07Z',
      );
      expect(githubClient.getCoverageSummary).toHaveBeenCalledTimes(4);
      expect(githubClient.getIssue).toHaveBeenCalledTimes(1);
      expect(githubClient.getIssue).toHaveBeenCalledWith(1234);
      expect(description).toContain(
        '| #1234 | bugfix | @dana<br />@bob<br />@sam | @alice #5678<br />@zoe #5680 |',
      );
      expect(description).toContain(
        '| api | branches: 90.12%<br />functions: 91.23%<br />lines: 92.34%<br />statements: 93.45% | Pending |',
      );
      expect(description).toContain(
        '| dependencies | dependencies | @reviewer | @maintainer #6792 |',
      );
      expect(description).toContain('- [ ] docker container `4.3.80`');
      expect(description).toContain('   npm run ecr:check-version');
      expect(description).toContain('|  |  |  | @solo #6790 |');
    });

    it('falls back to a generic docker container manual step when no tag can be extracted', async () => {
      const githubClient: GitHubClient = {
        getCoverageSummary: jest.fn().mockResolvedValue(undefined),
        getIssue: jest.fn(),
        getLatestProdPullRequest: jest.fn().mockResolvedValue({
          mergedAt: '2026-05-10T03:35:07Z',
          number: 4321,
        }),
        getPullRequest: jest.fn(),
        listMergedStagingPullRequests: jest
          .fn()
          .mockResolvedValue([dockerDependencyPullRequest]),
      };

      const description = await generateProdReleasePrDescription({
        circleConfig: 'version: 2.1\n',
        githubClient,
      });

      expect(description).toContain('- [ ] docker container');
    });

    it('does not add the docker-image manual step for dependency pull requests without file metadata', async () => {
      const githubClient: GitHubClient = {
        getCoverageSummary: jest.fn().mockResolvedValue(undefined),
        getIssue: jest.fn(),
        getLatestProdPullRequest: jest.fn().mockResolvedValue({
          mergedAt: '2026-05-10T03:35:07Z',
          number: 4321,
        }),
        getPullRequest: jest.fn(),
        listMergedStagingPullRequests: jest
          .fn()
          .mockResolvedValue([dependencyPullRequest]),
      };

      const description = await generateProdReleasePrDescription({
        circleConfig,
        githubClient,
      });

      expect(description).not.toContain('docker container `4.3.80`');
      expect(description).not.toContain('npm run ecr:check-version');
    });

    it('ignores empty bash code blocks when enriching pull requests', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: ['Before', '', '```bash', '   ', '```'].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([]);
    });

    it('uses the checklist text before a bash block as the manual step description', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: [
            'Manual release work is required.',
            '',
            '- [ ] Deploy account-specific terraform:',
            '',
            '```bash',
            'npm run deploy:account-specific',
            '```',
          ].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([
        {
          command: 'npm run deploy:account-specific',
          description: 'Deploy account-specific terraform',
        },
      ]);
    });
  });
  describe('cli integration', () => {
    const originalFetch = global.fetch;
    beforeEach(() => {
      jest.clearAllMocks();
      global.fetch = jest.fn();
    });

    afterAll(() => {
      global.fetch = originalFetch;
    });

    describe('prodReleasePrDescription', () => {
      it('writes the generated comment followed by a trailing newline', async () => {
        const write = jest.fn().mockReturnValue(true);
        const githubClient: GitHubClient = {
          getCoverageSummary: jest.fn().mockResolvedValue(undefined),
          getIssue: jest.fn().mockResolvedValue(issue),
          getLatestProdPullRequest: jest.fn().mockResolvedValue({
            mergedAt: '2026-05-10T03:35:07Z',
            number: 5678,
          }),
          getPullRequest: jest.fn(),
          listMergedStagingPullRequests: jest
            .fn()
            .mockResolvedValue([issueLinkedPullRequest]),
        };

        await prodReleasePrDescription({ githubClient, write });

        expect(write).toHaveBeenCalledWith(
          expect.stringContaining('### Includes'),
        );
        expect(write).toHaveBeenCalledWith(expect.stringMatching(/\n$/));
      });

      it('uses the default stdout writer and default github client when none are provided', async () => {
        const stdoutWriteSpy = jest
          .spyOn(process.stdout, 'write')
          .mockImplementation(() => true);
        const runCommandModule = require('../helpers/runCommand') as {
          runCommand: (...args: unknown[]) => Promise<string>;
        };
        const runCommandSpy = jest.spyOn(runCommandModule, 'runCommand');

        runCommandSpy
          .mockResolvedValueOnce(
            JSON.stringify([
              { mergedAt: '2026-05-10T03:35:07Z', number: 5678 },
            ]),
          )
          .mockResolvedValueOnce(JSON.stringify([{ number: 6790 }]))
          .mockResolvedValueOnce(JSON.stringify(blankPullRequest))
          .mockResolvedValueOnce(
            JSON.stringify({ nameWithOwner: 'ustaxcourt/ef-cms' }),
          )
          .mockResolvedValueOnce('gh-token');

        jest.mocked(global.fetch).mockResolvedValue({
          json: () => Promise.resolve({ artifacts: [] }),
          ok: true,
        } as Response);

        await prodReleasePrDescription();

        expect(stdoutWriteSpy).toHaveBeenCalledWith(
          expect.stringContaining('|  |  |  | @solo #6790 |'),
        );

        runCommandSpy.mockRestore();
        stdoutWriteSpy.mockRestore();
      });
    });
  });
});
