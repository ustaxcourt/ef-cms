import {
  type CoverageSuite,
  type CoverageSummary,
} from '../github-actions/suite-coverage.helpers';
import { getCoverageSummary as getStoredCoverageSummary } from '../github-actions/suite-coverage.helpers';
import { runCommand } from '../helpers/runCommand';

export type GitHubLabel = {
  name: string;
};

export type GitHubUser = {
  login?: string | null;
  name?: string | null;
};

export type GitHubCommit = {
  authors: GitHubUser[];
  messageHeadline: string;
};

export type GitHubPullRequestFile = {
  path: string;
};

export type GitHubPullRequest = {
  author: GitHubUser | null;
  body: string;
  commits: GitHubCommit[];
  files?: GitHubPullRequestFile[];
  labels: GitHubLabel[];
  number: number;
  title: string;
};

export type GitHubIssue = {
  assignees: GitHubUser[];
  body: string;
  labels: GitHubLabel[];
  number: number;
};

export type LatestProdPullRequest = {
  mergedAt: string;
  number: number;
};

export interface GitHubClient {
  getCoverageSummary(
    pullRequestNumber: number,
    suite: CoverageSuite,
    headSha?: string,
  ): Promise<CoverageSummary | undefined>;
  getIssue(issueNumber: number): Promise<GitHubIssue>;
  getLatestProdPullRequest(): Promise<LatestProdPullRequest>;
  getPullRequest(pullRequestNumber: number): Promise<GitHubPullRequest>;
  listMergedStagingPullRequests(
    mergedAfter: string,
  ): Promise<GitHubPullRequest[]>;
}

export type CommandRunner = (
  cmd: string,
  params?: string[],
  envvars?: { [key: string]: string },
) => Promise<string>;

const GH_ENV_VARS = {
  GH_PAGER: 'cat',
  PAGER: 'cat',
};

const parseJsonOutput = <T>(output: string): T => {
  return JSON.parse(output) as T;
};

const runGhJsonCommand = async <T>({
  args,
  commandRunner,
}: {
  args: string[];
  commandRunner: CommandRunner;
}): Promise<T> => {
  const output = await commandRunner('gh', args, GH_ENV_VARS);

  return parseJsonOutput<T>(output);
};

export class GhCliGitHubClient implements GitHubClient {
  private readonly commandRunner: CommandRunner;
  private cachedRepositoryNameWithOwner?: Promise<string>;
  private cachedToken?: Promise<string>;

  constructor({
    commandRunner = runCommand,
  }: { commandRunner?: CommandRunner } = {}) {
    this.commandRunner = commandRunner;
  }

  async getCoverageSummary(
    pullRequestNumber: number,
    suite: CoverageSuite,
    headSha?: string,
  ): Promise<CoverageSummary | undefined> {
    return await getStoredCoverageSummary({
      headSha,
      pullRequestNumber,
      repository: await this.getRepositoryNameWithOwner(),
      suite,
      token: await this.getGitHubToken(),
    });
  }

  async getIssue(issueNumber: number): Promise<GitHubIssue> {
    return await runGhJsonCommand<GitHubIssue>({
      args: [
        'issue',
        'view',
        issueNumber.toString(),
        '--json',
        'assignees,body,labels,number',
      ],
      commandRunner: this.commandRunner,
    });
  }

  private async getGitHubToken(): Promise<string> {
    if (!this.cachedToken) {
      this.cachedToken = this.commandRunner(
        'gh',
        ['auth', 'token'],
        GH_ENV_VARS,
      );
    }

    return await this.cachedToken;
  }

  async getLatestProdPullRequest(): Promise<LatestProdPullRequest> {
    const pullRequests = await runGhJsonCommand<LatestProdPullRequest[]>({
      args: [
        'pr',
        'list',
        '--base',
        'prod',
        '--state',
        'merged',
        '--limit',
        '1',
        '--json',
        'mergedAt,number',
      ],
      commandRunner: this.commandRunner,
    });

    const latestProdPullRequest = pullRequests[0];

    if (!latestProdPullRequest?.mergedAt || !latestProdPullRequest.number) {
      throw new Error(
        'Unable to determine the latest merged prod pull request timestamp.',
      );
    }

    return latestProdPullRequest;
  }

  async getPullRequest(pullRequestNumber: number): Promise<GitHubPullRequest> {
    return await runGhJsonCommand<GitHubPullRequest>({
      args: [
        'pr',
        'view',
        pullRequestNumber.toString(),
        '--json',
        'author,body,commits,files,labels,number,title',
      ],
      commandRunner: this.commandRunner,
    });
  }

  private async getRepositoryNameWithOwner(): Promise<string> {
    if (!this.cachedRepositoryNameWithOwner) {
      this.cachedRepositoryNameWithOwner = runGhJsonCommand<{
        nameWithOwner: string;
      }>({
        args: ['repo', 'view', '--json', 'nameWithOwner'],
        commandRunner: this.commandRunner,
      }).then(repository => repository.nameWithOwner);
    }

    return await this.cachedRepositoryNameWithOwner;
  }

  async listMergedStagingPullRequests(
    mergedAfter: string,
  ): Promise<GitHubPullRequest[]> {
    const pullRequestNumbers = await runGhJsonCommand<
      Array<{ number: number }>
    >({
      args: [
        'pr',
        'list',
        '--base',
        'staging',
        '--state',
        'merged',
        '--search',
        `merged:>${mergedAfter}`,
        '--limit',
        '100',
        '--json',
        'number',
      ],
      commandRunner: this.commandRunner,
    });

    return await Promise.all(
      pullRequestNumbers.map(({ number }: { number: number }) =>
        this.getPullRequest(number),
      ),
    );
  }
}
