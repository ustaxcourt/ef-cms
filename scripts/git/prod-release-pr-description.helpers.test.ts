/* eslint-disable max-lines */
jest.mock('../entity-validation/entityValidation', () => ({
  haveValidationRulesChanged: jest.fn(),
}));

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
import { haveValidationRulesChanged } from '../entity-validation/entityValidation';
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
    createdAt: '2026-05-10T03:00:00Z',
    labels: [],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 5678,
    title: '1234 fix the regression',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/5678',
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
    createdAt: '2026-05-10T03:00:00Z',
    labels: [],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 6789,
    title: 'deps: weekly dependency updates',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/6789',
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
    createdAt: '2026-05-10T03:00:00Z',
    files: [{ path: 'Dockerfile' }],
    labels: [],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 6792,
    title: 'dependencies 05-01-2026',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/6792',
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
    createdAt: '2026-05-10T03:00:00Z',
    labels: [],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 6790,
    title: 'misc cleanup',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/6790',
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
    createdAt: '2026-05-10T03:00:00Z',
    labels: [{ name: 'bugfix' }],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 6791,
    title: '5555 follow-up cleanup',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/6791',
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
    createdAt: '2026-05-10T03:00:00Z',
    labels: [],
    mergedAt: '2026-05-10T03:35:07Z',
    number: 5680,
    title: '1234 fix the regression more',
    url: 'https://github.com/ustaxcourt/ef-cms/pull/5680',
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

    it('classifies issue-backed pull requests as bugfixes when the issue uses the bug template heading', () => {
      expect(
        resolveType({
          issue: {
            assignees: [],
            body: '**Describe the Bug**\n\nThe thing broke.',
            labels: [],
            number: 1235,
          },
          pullRequest: issueLinkedPullRequest,
          ticketTask: '#1235',
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

    it('renders suggested labels based on files and manual steps', () => {
      const enrichedPullRequests: any[] = [
        {
          manualSteps: [
            {
              command: 'npm run deploy:account-specific',
              description: 'Deploy',
            },
          ],
          otherContributors: ['@sam'],
          pullRequest: {
            author: { login: 'alice' },
            body: 'Manual step included.',
            commits: [],
            createdAt: '2026-05-10T03:00:00Z',
            files: [
              {
                path: 'web-api/src/persistence/postgres/utils/migrate/migrations/2026-01-01-new-table.js',
              },
              {
                path: 'web-api/src/persistence/postgres/utils/migrate/migrations/deprecated/111-some-migration.js',
              },
            ],
            labels: [],
            mergedAt: '2026-05-10T03:35:07Z',
            number: 6791,
            title: '1234 adding migration and validation updates',
            url: 'https://github.com/ustaxcourt/ef-cms/pull/6791',
          },
          ticketTask: '#1234',
          type: 'story',
        },
      ];

      const description = renderPrDescription({
        enrichedPullRequests,
        validationRulesUpdated: true,
      });

      expect(description).toContain(
        [
          '### Suggested labels',
          '',
          '- `Manual Deploy Step(s) Required`',
          '- `Needs Account Specific`',
          '- `Data Migration`',
          '- `Validation Rules Updated`',
        ].join('\n'),
      );
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
                description: 'Manual step',
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

    it('keeps identical commands when they belong to different deployment sections', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            manualSteps: [
              {
                command: 'npm run verify',
                description: 'Verify before deployment',
                section: 'before',
              },
              {
                command: 'npm run verify',
                description: 'Verify after deployment',
                section: 'after',
              },
            ],
            otherContributors: [],
            pullRequest: blankPullRequest,
            ticketTask: '',
            type: '',
          },
        ],
      });

      expect(description.match(/npm run verify/g)).toHaveLength(2);
      expect(description).toContain('- [ ] Verify before deployment');
      expect(description).toContain('- [ ] Verify after deployment');
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
        getMergeCommitStatusContexts: jest.fn(),
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

      jest.mocked(haveValidationRulesChanged).mockResolvedValue(true);

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
        getMergeCommitStatusContexts: jest.fn(),
        getLatestProdPullRequest: jest.fn().mockResolvedValue({
          mergedAt: '2026-05-10T03:35:07Z',
          number: 4321,
        }),
        getPullRequest: jest.fn(),
        listMergedStagingPullRequests: jest
          .fn()
          .mockResolvedValue([dockerDependencyPullRequest]),
      };

      jest.mocked(haveValidationRulesChanged).mockResolvedValue(false);

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
        getMergeCommitStatusContexts: jest.fn(),
        getLatestProdPullRequest: jest.fn().mockResolvedValue({
          mergedAt: '2026-05-10T03:35:07Z',
          number: 4321,
        }),
        getPullRequest: jest.fn(),
        listMergedStagingPullRequests: jest
          .fn()
          .mockResolvedValue([dependencyPullRequest]),
      };

      jest.mocked(haveValidationRulesChanged).mockResolvedValue(false);

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

    it('ignores unclosed bash code blocks when enriching pull requests', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: ['Before', '', '```bash', 'npm run incomplete'].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([]);
    });

    it('retains surrounding text and checklist text before a bash block', () => {
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
          description:
            'Manual release work is required.\n\nDeploy account-specific terraform:',
        },
      ]);
    });

    it('retains manual deployment sections and surrounding text for each bash command', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: [
            '## Verification',
            '',
            '```bash',
            'npm run verify',
            '```',
            '',
            '## Manual Deployment Steps',
            '',
            '### Before Deployment',
            '',
            '#### Prepare the deployment',
            '',
            'Run this command before deploying:',
            '',
            '```bash',
            'npm run deploy:prepare',
            '```',
            '',
            '### After Deployment',
            '',
            'Confirm the deployment completed successfully:',
            '',
            '```bash',
            'npm run deploy:verify',
            '```',
            '',
            '## Notes',
            '',
            '```bash',
            'npm run ignore',
            '```',
          ].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([
        {
          command: 'npm run deploy:prepare',
          description:
            'Prepare the deployment\n\nRun this command before deploying:',
          section: 'before',
        },
        {
          command: 'npm run deploy:verify',
          description: 'Confirm the deployment completed successfully:',
          section: 'after',
        },
      ]);

      const description = renderPrDescription({
        enrichedPullRequests: [enrichedPullRequest],
      });

      expect(description.match(/#### Before Deployment/g)).toHaveLength(1);
      expect(description.match(/#### After Deployment/g)).toHaveLength(1);
      expect(description.indexOf('#### Before Deployment')).toBeLessThan(
        description.indexOf('#### After Deployment'),
      );
      expect(description).toContain(
        [
          '- [ ] Prepare the deployment',
          '   ',
          '   Run this command before deploying:',
          '   ```bash',
          '   npm run deploy:prepare',
          '   ```',
        ].join('\n'),
      );
      expect(description).toContain(
        [
          '- [ ] Confirm the deployment completed successfully:',
          '   ```bash',
          '   npm run deploy:verify',
          '   ```',
        ].join('\n'),
      );
      expect(description).not.toContain('npm run verify');
      expect(description).not.toContain('npm run ignore');
    });

    it('does not carry a deployment section through an unrelated heading', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: [
            '## Manual Deployment Steps',
            '',
            '### Before Deployment',
            '',
            '### Verification',
            '',
            '```bash',
            'npm run verify',
            '```',
            '',
            '## Before Deployment',
            '',
            '```bash',
            'npm run outside',
            '```',
          ].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([
        {
          command: 'npm run verify',
          description: 'Verification',
        },
      ]);
    });

    it('uses a generic checkbox description when no surrounding text exists', () => {
      const enrichedPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: [
            '### Before Deployment',
            '',
            '```bash',
            'npm run verify',
            '```',
          ].join('\n'),
        },
      });

      expect(enrichedPullRequest.manualSteps).toEqual([
        {
          command: 'npm run verify',
          description: 'Manual step',
          section: 'before',
        },
      ]);

      const emptyDescriptionPullRequest = enrichPullRequest({
        pullRequest: {
          ...blankPullRequest,
          body: ['- [ ]', '', '```bash', 'npm run verify', '```'].join('\n'),
        },
      });

      expect(emptyDescriptionPullRequest.manualSteps).toEqual([
        {
          command: 'npm run verify',
          description: 'Manual step',
        },
      ]);
    });

    it('groups before and after manual steps from multiple pull requests', () => {
      const description = renderPrDescription({
        enrichedPullRequests: [
          {
            manualSteps: [
              {
                command: 'before-one',
                description: 'Before one',
                section: 'before',
              },
              {
                command: 'after-one',
                description: 'After one',
                section: 'after',
              },
            ],
            otherContributors: [],
            pullRequest: { ...blankPullRequest, number: 7005 },
            ticketTask: '',
            type: '',
          },
          {
            manualSteps: [
              {
                command: 'before-two',
                description: 'Before two',
                section: 'before',
              },
            ],
            otherContributors: [],
            pullRequest: { ...blankPullRequest, number: 7006 },
            ticketTask: '',
            type: '',
          },
        ],
      });

      expect(description.match(/#### Before Deployment/g)).toHaveLength(1);
      expect(description.match(/#### After Deployment/g)).toHaveLength(1);
      expect(description.indexOf('before-one')).toBeLessThan(
        description.indexOf('before-two'),
      );
      expect(description.indexOf('before-two')).toBeLessThan(
        description.indexOf('after-one'),
      );
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
          getIssue: jest.fn(),
          getMergeCommitStatusContexts: jest.fn(),
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
