import {
  extractCircleCiUrl,
  hasDataMigration,
  hasManualSteps,
  generateWikiSummary,
  getPostgresMigrationTimings,
} from './wiki-deployment-summary.helpers';
import type {
  GitHubClient,
  GitHubPullRequest,
  GitHubUser,
} from './github-client';

describe('wiki-deployment-summary.helpers', () => {
  const mockUser: GitHubUser = { login: 'some-user' };
  const originalFetch = global.fetch;

  const createCircleCiResponse = ({
    endTime,
    stepName,
    startTime,
  }: {
    endTime: string;
    stepName: string;
    startTime: string;
  }): Response =>
    ({
      json: jest.fn().mockResolvedValue({
        steps: [
          {
            actions: [
              {
                end_time: endTime,
                start_time: startTime,
              },
            ],
            name: stepName,
          },
        ],
      }),
      ok: true,
    }) as unknown as Response;

  const mockGhClient: jest.Mocked<GitHubClient> = {
    getCoverageSummary: jest.fn(),
    getIssue: jest.fn(),
    getLatestProdPullRequest: jest.fn(),
    getMergeCommitStatusContexts: jest.fn(),
    getPullRequest: jest.fn(),
    listMergedStagingPullRequests: jest.fn(),
  };

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  describe('Helper: extractCircleCiUrl', () => {
    it('returns targetUrl when ci/circleci: deploy context is present', () => {
      const pr = {
        author: mockUser,
        body: '',
        commits: [],
        createdAt: '2025-12-05T13:58:00Z',
        labels: [],
        mergedAt: '2025-12-06T15:00:00Z',
        number: 123,
        statusCheckRollup: [
          { context: 'ci/circleci: build', targetUrl: 'http://build' },
          { context: 'ci/circleci: deploy', targetUrl: 'http://deploy' },
        ],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest;

      expect(extractCircleCiUrl(pr)).toEqual('http://deploy');
    });

    it('returns placeholder when no deploy context is present', () => {
      const pr = {
        author: mockUser,
        body: '',
        commits: [],
        createdAt: '2025-12-05T13:58:00Z',
        labels: [],
        mergedAt: '2025-12-06T15:00:00Z',
        number: 123,
        statusCheckRollup: [],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest;

      expect(extractCircleCiUrl(pr)).toEqual('<INSERT_CIRCLECI_URL>');
    });

    it('returns placeholder when statusCheckRollup is undefined', () => {
      const pr = {
        statusCheckRollup: undefined,
      } as GitHubPullRequest;
      expect(extractCircleCiUrl(pr)).toEqual('<INSERT_CIRCLECI_URL>');
    });
  });

  describe('Helper: hasDataMigration', () => {
    it('returns true when data migration label is present', () => {
      const pr = {
        labels: [{ name: 'Data Migration ' }],
      } as GitHubPullRequest;
      expect(hasDataMigration(pr)).toBe(true);
    });

    it('returns false when data migration label is absent', () => {
      const pr = {
        labels: [{ name: 'bugfix' }],
      } as GitHubPullRequest;
      expect(hasDataMigration(pr)).toBe(false);
    });
  });

  describe('Helper: hasManualSteps', () => {
    it('returns true when manual steps label is present', () => {
      const pr = {
        labels: [{ name: ' manual deploy step(s) required' }],
      } as GitHubPullRequest;
      expect(hasManualSteps(pr)).toBe(true);
    });

    it('returns false when manual steps label is absent', () => {
      const pr = {
        labels: [{ name: 'bugfix' }],
      } as GitHubPullRequest;
      expect(hasManualSteps(pr)).toBe(false);
    });
  });

  describe('CircleCI step timing helper: getPostgresMigrationTimings', () => {
    it('returns undefined when the job URL does not match CircleCI format', async () => {
      expect(await getPostgresMigrationTimings('invalid-url')).toBeUndefined();
    });

    it('returns undefined when the CircleCI fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
      });

      expect(
        await getPostgresMigrationTimings(
          'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        ),
      ).toBeUndefined();
    });

    it('returns timings when the migration step exists in the job response', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          steps: [
            {
              name: 'Run Postgres Migration',
              actions: [
                {
                  start_time: '2025-12-06T15:05:00Z',
                  end_time: '2025-12-06T15:10:00Z',
                },
              ],
            },
          ],
        }),
        ok: true,
      });

      const result = await getPostgresMigrationTimings(
        'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
      );

      expect(result).toEqual({
        endTime: '2025-12-06T15:10:00Z',
        startTime: '2025-12-06T15:05:00Z',
      });
    });

    it('returns undefined when the CircleCI response omits steps', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({}),
        ok: true,
      });

      expect(
        await getPostgresMigrationTimings(
          'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        ),
      ).toBeUndefined();
    });

    it('returns undefined when the migration step has invalid timestamps', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          steps: [
            {
              name: 'Run Postgres Migration',
              actions: [
                {
                  start_time: 'invalid-start-time',
                  end_time: 'invalid-end-time',
                },
              ],
            },
          ],
        }),
        ok: true,
      });

      expect(
        await getPostgresMigrationTimings(
          'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        ),
      ).toBeUndefined();
    });

    it('returns undefined when the response is missing steps or timestamps', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          steps: [
            {
              name: 'Some Other Step',
              actions: [],
            },
            {
              name: 'Run Postgres Migration',
              actions: [],
            },
          ],
        }),
        ok: true,
      });
      expect(
        await getPostgresMigrationTimings(
          'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        ),
      ).toBeUndefined();
    });

    it('returns undefined when the CircleCI request rejects', async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      expect(
        await getPostgresMigrationTimings(
          'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        ),
      ).toBeUndefined();
    });
  });

  describe('generateWikiSummary', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('generates the summary correctly when falling back to the latest prod PR', async () => {
      mockGhClient.getLatestProdPullRequest.mockResolvedValue({
        mergedAt: '2025-12-05T12:00:00Z',
        number: 995,
      });

      mockGhClient.getPullRequest.mockResolvedValue({
        author: mockUser,
        body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n| #5678 | bugfix |\n| opex | opex |`,
        commits: [],
        createdAt: '2025-12-05T13:00:00.000Z',
        labels: [
          { name: 'Data Migration' },
          { name: 'Manual Deploy Step(s) Required' },
        ],
        mergedAt: '2025-12-06T15:00:00.000Z',
        number: 995,
        statusCheckRollup: [
          { context: 'ci/circleci: deploy', targetUrl: 'http://deploy' },
        ],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest);

      const result = await generateWikiSummary(mockGhClient);

      expect(mockGhClient.getLatestProdPullRequest).toHaveBeenCalled();
      expect(result).toContain('## General Notes');
      expect(result).not.toContain(
        '**Note:** This deployment includes a data migration.',
      );
      expect(result).toContain(
        '**Note:** This deployment includes manual steps.',
      );
      expect(result).toContain('### Feature Stories');
      expect(result).toContain(
        '- https://github.com/ustaxcourt/ef-cms/issues/1234',
      );
      expect(result).toContain('### Bug Fixes');
      expect(result).toContain(
        '- https://github.com/ustaxcourt/ef-cms/issues/5678',
      );
      expect(result).toContain('### Timeline');
      expect(result).toContain('(2025-12-05)');
      expect(result).toContain('08:00 - Created the Pull Request');
      expect(result).toContain('(2025-12-06)');
      expect(result).toContain(
        '10:00 - Merged the PR [CircleCI Build](http://deploy)',
      );
    });

    it('uses the provided PR number and handles empty lists and same-day merges', async () => {
      mockGhClient.getPullRequest.mockResolvedValue({
        author: mockUser,
        body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | NO |\n`,
        commits: [],
        createdAt: '2025-12-05T13:00:00.000Z',
        labels: [],
        mergedAt: '2025-12-05T15:00:00.000Z',
        number: 888,
        statusCheckRollup: [],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest);

      const result = await generateWikiSummary(mockGhClient, 888);

      expect(mockGhClient.getLatestProdPullRequest).not.toHaveBeenCalled();
      expect(mockGhClient.getPullRequest).toHaveBeenCalledWith(888);

      expect(result).not.toContain(
        '**Note:** This deployment includes a data migration.',
      );
      expect(result).not.toContain(
        '**Note:** This deployment includes manual steps.',
      );

      expect(result).toContain('### Feature Stories\nNone');
      expect(result).toContain('### Bug Fixes\nNone');

      const dateMatches = result.match(/\(2025-12-05\)/g);
      expect(dateMatches?.length).toBe(1);
    });

    it('handles an unmerged PR', async () => {
      mockGhClient.getPullRequest.mockResolvedValue({
        author: mockUser,
        body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | NO |\n`,
        commits: [],
        createdAt: '2025-12-05T13:00:00.000Z',
        labels: [],
        mergedAt: null,
        number: 888,
        statusCheckRollup: [],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest);

      const result = await generateWikiSummary(mockGhClient, 888);
      expect(result).not.toContain('Merged the PR');
    });

    it('generates the summary with merge commit and mapped status contexts', async () => {
      mockGhClient.getLatestProdPullRequest.mockResolvedValue({
        mergedAt: '2025-12-05T12:00:00Z',
        number: 995,
      });

      mockGhClient.getPullRequest.mockResolvedValue({
        author: mockUser,
        body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
        commits: [],
        createdAt: '2025-12-05T13:00:00.000Z',
        labels: [],
        mergeCommit: { oid: 'merge-commit-oid' },
        mergedAt: '2025-12-06T15:00:00.000Z',
        number: 995,
        statusCheckRollup: [],
        title: 'Title',
        url: 'http://pr',
      } as GitHubPullRequest);

      global.fetch = jest.fn().mockResolvedValue({
        json: jest.fn().mockResolvedValue({
          steps: [
            {
              name: 'Run Postgres Migration',
              actions: [
                {
                  start_time: '2025-12-06T15:06:00.000Z',
                  end_time: '2025-12-06T15:07:00.000Z',
                },
              ],
            },
          ],
        }),
        ok: true,
      });

      mockGhClient.getMergeCommitStatusContexts = jest.fn().mockResolvedValue([
        {
          context: 'ci/circleci: deploy',
          createdAt: '2025-12-06T15:05:00.000Z',
          targetUrl: 'http://deploy',
        },
        {
          context: 'ci/circleci: migrate',
          createdAt: '2025-12-06T15:05:00.000Z',
          targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
        },
        {
          context: 'ci/circleci: switch-colors',
          createdAt: '2025-12-06T15:10:00.000Z',
          targetUrl: 'http://switch',
        },
        {
          context: 'ci/circleci: unknown',
          createdAt: '2025-12-06T15:01:00.000Z',
          targetUrl: 'http://unknown',
        },
      ]);

      const result = await generateWikiSummary(mockGhClient);

      expect(mockGhClient.getMergeCommitStatusContexts).toHaveBeenCalledWith(
        'merge-commit-oid',
      );

      expect(result).toContain('10:05 - Deploy step completes');
      expect(result).toContain('10:10 - Switched colors');
    });

    describe('timing-based timeline events', () => {
      it('adds data migration timeline events when the migration is labeled and timings are found', async () => {
        mockGhClient.getLatestProdPullRequest.mockResolvedValue({
          mergedAt: '2025-12-05T12:00:00Z',
          number: 995,
        });

        mockGhClient.getPullRequest.mockResolvedValue({
          author: mockUser,
          body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
          commits: [],
          createdAt: '2025-12-05T13:00:00.000Z',
          labels: [{ name: 'Data Migration' }],
          mergeCommit: { oid: 'merge-commit-oid' },
          mergedAt: '2025-12-06T15:00:00.000Z',
          number: 995,
          statusCheckRollup: [],
          title: 'Title',
          url: 'http://pr',
        } as GitHubPullRequest);

        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue({
            steps: [
              {
                name: 'Run Postgres Migration',
                actions: [
                  {
                    start_time: '2025-12-06T15:06:00.000Z',
                    end_time: '2025-12-06T15:07:00.000Z',
                  },
                ],
              },
            ],
          }),
          ok: true,
        });

        mockGhClient.getMergeCommitStatusContexts = jest
          .fn()
          .mockResolvedValue([
            {
              context: 'ci/circleci: deploy',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'http://deploy',
            },
            {
              context: 'ci/circleci: migrate',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
            },
          ]);

        const result = await generateWikiSummary(mockGhClient);

        expect(result).toContain('10:06 - Data migration begins');
        expect(result).toContain('10:07 - Data migration completes');
      });

      it('adds data migration timeline events when the migration step runs long enough without a label', async () => {
        mockGhClient.getLatestProdPullRequest.mockResolvedValue({
          mergedAt: '2025-12-05T12:00:00Z',
          number: 995,
        });

        mockGhClient.getPullRequest.mockResolvedValue({
          author: mockUser,
          body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
          commits: [],
          createdAt: '2025-12-05T13:00:00.000Z',
          labels: [],
          mergeCommit: { oid: 'merge-commit-oid' },
          mergedAt: '2025-12-06T15:00:00.000Z',
          number: 995,
          statusCheckRollup: [],
          title: 'Title',
          url: 'http://pr',
        } as GitHubPullRequest);

        global.fetch = jest.fn().mockResolvedValueOnce(
          createCircleCiResponse({
            endTime: '2025-12-06T15:07:00.000Z',
            stepName: 'Run Postgres Migration',
            startTime: '2025-12-06T15:06:00.000Z',
          }),
        );

        mockGhClient.getMergeCommitStatusContexts = jest
          .fn()
          .mockResolvedValue([
            {
              context: 'ci/circleci: migrate',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
            },
          ]);

        const result = await generateWikiSummary(mockGhClient);

        expect(result).toContain('10:06 - Data migration begins');
        expect(result).toContain('10:07 - Data migration completes');
      });

      it('adds entity validation timeline events when the validation step runs long enough', async () => {
        mockGhClient.getLatestProdPullRequest.mockResolvedValue({
          mergedAt: '2025-12-05T12:00:00Z',
          number: 995,
        });

        mockGhClient.getPullRequest.mockResolvedValue({
          author: mockUser,
          body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
          commits: [],
          createdAt: '2025-12-05T13:00:00.000Z',
          labels: [],
          mergeCommit: { oid: 'merge-commit-oid' },
          mergedAt: '2025-12-06T15:00:00.000Z',
          number: 995,
          statusCheckRollup: [],
          title: 'Title',
          url: 'http://pr',
        } as GitHubPullRequest);

        global.fetch = jest.fn().mockResolvedValueOnce(
          createCircleCiResponse({
            endTime: '2025-12-06T15:07:00.000Z',
            stepName: 'Run Entity Validation',
            startTime: '2025-12-06T15:06:00.000Z',
          }),
        );

        mockGhClient.getMergeCommitStatusContexts = jest
          .fn()
          .mockResolvedValue([
            {
              context: 'ci/circleci: validate-entities',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/5678',
            },
          ]);

        const result = await generateWikiSummary(mockGhClient);

        expect(result).toContain('10:06 - Entity validation begins');
        expect(result).toContain('10:07 - Entity validation completes');
      });

      it('does not add timing-based timeline events when both steps run too quickly', async () => {
        mockGhClient.getLatestProdPullRequest.mockResolvedValue({
          mergedAt: '2025-12-05T12:00:00Z',
          number: 995,
        });

        mockGhClient.getPullRequest.mockResolvedValue({
          author: mockUser,
          body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
          commits: [],
          createdAt: '2025-12-05T13:00:00.000Z',
          labels: [],
          mergeCommit: { oid: 'merge-commit-oid' },
          mergedAt: '2025-12-06T15:00:00.000Z',
          number: 995,
          statusCheckRollup: [],
          title: 'Title',
          url: 'http://pr',
        } as GitHubPullRequest);

        global.fetch = jest
          .fn()
          .mockResolvedValueOnce(
            createCircleCiResponse({
              endTime: '2025-12-06T15:00:20.000Z',
              stepName: 'Run Postgres Migration',
              startTime: '2025-12-06T15:00:00.000Z',
            }),
          )
          .mockResolvedValueOnce(
            createCircleCiResponse({
              endTime: '2025-12-06T15:00:25.000Z',
              stepName: 'Run Entity Validation',
              startTime: '2025-12-06T15:00:05.000Z',
            }),
          );

        mockGhClient.getMergeCommitStatusContexts = jest
          .fn()
          .mockResolvedValue([
            {
              context: 'ci/circleci: migrate',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
            },
            {
              context: 'ci/circleci: validate-entities',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/5678',
            },
          ]);

        const result = await generateWikiSummary(mockGhClient);

        expect(result).not.toContain('Data migration begins');
        expect(result).not.toContain('Data migration completes');
        expect(result).not.toContain('Entity validation begins');
        expect(result).not.toContain('Entity validation completes');
      });

      it('does not add data migration timeline events when migration timings are unavailable', async () => {
        mockGhClient.getLatestProdPullRequest.mockResolvedValue({
          mergedAt: '2025-12-05T12:00:00Z',
          number: 995,
        });

        mockGhClient.getPullRequest.mockResolvedValue({
          author: mockUser,
          body: `### Includes\n| Ticket/Task | Type |\n| --- | --- |\n| #1234 | story |\n`,
          commits: [],
          createdAt: '2025-12-05T13:00:00.000Z',
          labels: [{ name: 'Data Migration' }],
          mergeCommit: { oid: 'merge-commit-oid' },
          mergedAt: '2025-12-06T15:00:00.000Z',
          number: 995,
          statusCheckRollup: [],
          title: 'Title',
          url: 'http://pr',
        } as GitHubPullRequest);

        global.fetch = jest.fn().mockResolvedValue({
          json: jest.fn().mockResolvedValue({
            steps: [
              {
                name: 'Some Other Step',
                actions: [],
              },
            ],
          }),
          ok: true,
        });

        mockGhClient.getMergeCommitStatusContexts = jest
          .fn()
          .mockResolvedValue([
            {
              context: 'ci/circleci: migrate',
              createdAt: '2025-12-06T15:05:00.000Z',
              targetUrl: 'https://circleci.com/gh/ustaxcourt/ef-cms/1234',
            },
          ]);

        const result = await generateWikiSummary(mockGhClient);

        expect(result).not.toContain('Data migration begins');
        expect(result).not.toContain('Data migration completes');
      });
    });
  });
});
