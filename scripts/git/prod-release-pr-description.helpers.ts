import { readFileSync } from 'fs';
import path from 'path';
import {
  COVERAGE_SUITES,
  renderCoverageSection,
  type CoverageSuite,
  type CoverageSummary,
} from '../github-actions/suite-coverage.helpers';
import {
  GhCliGitHubClient,
  type GitHubClient,
  type GitHubCommit,
  type GitHubIssue,
  type GitHubLabel,
  type GitHubPullRequest,
  type GitHubPullRequestFile,
  type GitHubUser,
} from './github-client';

export type ManualStep = {
  command: string;
  description: string;
};

export type EnrichedPullRequest = {
  issue?: GitHubIssue;
  manualSteps: ManualStep[];
  otherContributors: string[];
  pullRequest: GitHubPullRequest;
  ticketTask: string;
  type: string;
};

type GroupedReleaseEntry = {
  entries: EnrichedPullRequest[];
  otherContributors: string[];
  ticketTask: string;
  type: string;
};

const DEPENDENCIES_PATTERN = /\b(?:dependencies|deps)\b/i;
const DEVEX_PATTERN = /^devex\b/i;
const ISSUE_NUMBER_PATTERN = /^(\d+)\b/;
const MERGE_COMMIT_PATTERN = /^Merge\b/;
const OPEX_PATTERN = /^opex\b/i;
const BUG_DESCRIPTION_HEADING_PATTERN = /^[\s*_#>~-]*describe the bug\b/i;
const BUG_LABEL = 'bug';
const BUGFIX_LABEL = 'bugfix';
const BASH_CODE_BLOCK_PATTERN = /```bash\s*\n([\s\S]*?)```/gi;
const CHECKBOX_LIST_ITEM_PATTERN = /^\s*-\s*(?:\[[ xX]]\s*)?(.*?):?\s*$/;
const COPILOT_PATTERN = /copilot/i;
const CIRCLE_CONFIG_PATH = path.join(
  __dirname,
  '..',
  '..',
  '.circleci',
  'config.yml',
);
const DOCKER_IMAGE_TAG_PATTERN =
  /efcms-docker-image:\s*&efcms-docker-image\s+\S+:([^\s]+)/;
const TABLE_HEADER = '| Ticket/Task | Type | Other Contributors | PR Made By |';
const TABLE_DIVIDER = '| --- | --- | --- | --- |';

const normalizeLineEndings = (value: string): string => {
  return value.replace(/\r\n/g, '\n');
};

const normalizeLabelName = (label: GitHubLabel): string => {
  return label.name.trim().toLowerCase();
};

const normalizeWhitespace = (value: string): string => {
  return normalizeLineEndings(value).trim();
};

export const extractIssueNumberFromTitle = (
  title: string,
): number | undefined => {
  const matches = title.trim().match(ISSUE_NUMBER_PATTERN);

  if (!matches) {
    return undefined;
  }

  return Number(matches[1]);
};

export const resolveTicketTask = (title: string): string => {
  const issueNumber = extractIssueNumberFromTitle(title);

  if (issueNumber) {
    return `#${issueNumber}`;
  }

  if (DEPENDENCIES_PATTERN.test(title)) {
    return 'dependencies';
  }

  if (DEVEX_PATTERN.test(title)) {
    return 'devex';
  }

  if (OPEX_PATTERN.test(title)) {
    return 'opex';
  }

  return '';
};

export const resolveType = ({
  issue,
  pullRequest,
  ticketTask,
}: {
  issue?: GitHubIssue;
  pullRequest: GitHubPullRequest;
  ticketTask: string;
}): string => {
  if (
    ticketTask === 'dependencies' ||
    ticketTask === 'devex' ||
    ticketTask === 'opex'
  ) {
    return ticketTask;
  }

  if (!issue) {
    return '';
  }

  const issueHasBugLabel = issue.labels.some(
    label => normalizeLabelName(label) === BUG_LABEL,
  );
  const prHasBugfixLabel = pullRequest.labels.some(
    label => normalizeLabelName(label) === BUGFIX_LABEL,
  );
  const issueStartsWithBugDescription = BUG_DESCRIPTION_HEADING_PATTERN.test(
    issue.body.trimStart(),
  );

  if (issueHasBugLabel || issueStartsWithBugDescription || prHasBugfixLabel) {
    return 'bugfix';
  }

  return 'story';
};

export const extractBashCodeBlocks = (body: string): string[] => {
  const normalizedBody = normalizeLineEndings(body);
  const codeBlocks: string[] = [];

  for (const match of normalizedBody.matchAll(BASH_CODE_BLOCK_PATTERN)) {
    const codeBlock = normalizeWhitespace(match[1]);

    if (codeBlock) {
      codeBlocks.push(codeBlock);
    }
  }

  return codeBlocks;
};

export const extractDockerImageTag = (
  circleConfig: string,
): string | undefined => {
  const match = circleConfig.match(DOCKER_IMAGE_TAG_PATTERN);

  return match?.[1];
};

const isCopilotContributor = (contributor: string): boolean => {
  return COPILOT_PATTERN.test(contributor);
};

const formatUser = (user: GitHubUser | null | undefined): string => {
  const login = user?.login?.trim();

  if (login) {
    return `@${login}`;
  }

  const name = user?.name?.trim();

  return name ?? '';
};

const escapeTableCell = (value: string): string => {
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br />');
};

const isMergeCommit = (commit: GitHubCommit): boolean => {
  return MERGE_COMMIT_PATTERN.test(commit.messageHeadline.trim());
};

const dedupeContributors = (contributors: string[]): string[] => {
  const uniqueContributors = new Set<string>();

  for (const contributor of contributors) {
    uniqueContributors.add(contributor);
  }

  return Array.from(uniqueContributors).filter(Boolean);
};

const resolveOtherContributorList = ({
  issue,
  pullRequest,
}: {
  issue?: GitHubIssue;
  pullRequest: GitHubPullRequest;
}): string[] => {
  const prAuthor = formatUser(pullRequest.author);
  const issueAssignees =
    issue?.assignees.map(assignee => formatUser(assignee)).filter(Boolean) ??
    [];
  const commitAuthors = pullRequest.commits
    .filter(commit => !isMergeCommit(commit))
    .flatMap(commit => commit.authors.map(author => formatUser(author)))
    .filter(Boolean);
  const contributors = dedupeContributors([
    ...issueAssignees,
    ...commitAuthors,
  ]);

  return contributors.filter(
    contributor =>
      contributor !== prAuthor && !isCopilotContributor(contributor),
  );
};

export const resolveOtherContributors = ({
  issue,
  pullRequest,
}: {
  issue?: GitHubIssue;
  pullRequest: GitHubPullRequest;
}): string => {
  return resolveOtherContributorList({ issue, pullRequest }).join('<br />');
};

const renderPrMadeBy = (pullRequest: GitHubPullRequest): string => {
  const author = formatUser(pullRequest.author);

  if (!author) {
    return `#${pullRequest.number}`;
  }

  return `${author} #${pullRequest.number}`;
};

const renderGroupedTableRow = (
  groupedReleaseEntry: GroupedReleaseEntry,
): string => {
  const prMadeBy = groupedReleaseEntry.entries
    .map(entry => renderPrMadeBy(entry.pullRequest))
    .join('<br />');

  return `| ${escapeTableCell(groupedReleaseEntry.ticketTask)} | ${escapeTableCell(groupedReleaseEntry.type)} | ${escapeTableCell(groupedReleaseEntry.otherContributors.join('<br />'))} | ${escapeTableCell(prMadeBy)} |`;
};

const extractManualSteps = (body: string): ManualStep[] => {
  const lines = normalizeLineEndings(body).split('\n');
  const manualSteps: ManualStep[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (lines[index].trim() !== '```bash') {
      continue;
    }

    const openingFenceIndex = index;
    const commandLines: string[] = [];

    for (
      let commandIndex = index + 1;
      commandIndex < lines.length;
      commandIndex += 1
    ) {
      if (lines[commandIndex].trim() === '```') {
        index = commandIndex;
        break;
      }

      commandLines.push(lines[commandIndex]);
    }

    const command = normalizeWhitespace(commandLines.join('\n'));

    if (!command) {
      continue;
    }

    const previousNonEmptyLine = [...lines.slice(0, openingFenceIndex)]
      .reverse()
      .find(line => line.trim().length > 0);
    const descriptionMatch = previousNonEmptyLine?.match(
      CHECKBOX_LIST_ITEM_PATTERN,
    );
    const description = descriptionMatch?.[1]?.trim() || 'Manual step';

    manualSteps.push({ command, description });
  }

  return manualSteps;
};

const hasDockerfileChange = (pullRequest: GitHubPullRequest): boolean => {
  return (
    pullRequest.files?.some(
      (file: GitHubPullRequestFile): boolean => file.path === 'Dockerfile',
    ) ?? false
  );
};

const dedupeManualSteps = (manualSteps: ManualStep[]): ManualStep[] => {
  const uniqueSteps = new Map<string, ManualStep>();

  for (const manualStep of manualSteps) {
    const existingManualStep = uniqueSteps.get(manualStep.command);

    if (!existingManualStep) {
      uniqueSteps.set(manualStep.command, manualStep);
      continue;
    }

    if (
      existingManualStep.description === 'Manual step' &&
      manualStep.description !== 'Manual step'
    ) {
      uniqueSteps.set(manualStep.command, manualStep);
    }
  }

  return Array.from(uniqueSteps.values());
};

const resolveManualSteps = ({
  dockerImageTag,
  pullRequest,
}: {
  dockerImageTag?: string;
  pullRequest: GitHubPullRequest;
}): ManualStep[] => {
  const manualSteps = extractManualSteps(pullRequest.body);

  if (
    resolveTicketTask(pullRequest.title) === 'dependencies' &&
    hasDockerfileChange(pullRequest)
  ) {
    manualSteps.push({
      command: 'npm run ecr:check-version',
      description: dockerImageTag
        ? `docker container \`${dockerImageTag}\``
        : 'docker container',
    });
  }

  return dedupeManualSteps(manualSteps);
};

const groupEnrichedPullRequests = (
  enrichedPullRequests: EnrichedPullRequest[],
): GroupedReleaseEntry[] => {
  const groupedEntries = new Map<string, GroupedReleaseEntry>();

  for (const enrichedPullRequest of enrichedPullRequests) {
    const groupKey = enrichedPullRequest.issue
      ? `issue:${enrichedPullRequest.issue.number}`
      : `pr:${enrichedPullRequest.pullRequest.number}`;
    const existingGroup = groupedEntries.get(groupKey);

    if (existingGroup) {
      existingGroup.entries.push(enrichedPullRequest);
      continue;
    }

    groupedEntries.set(groupKey, {
      entries: [enrichedPullRequest],
      otherContributors: [],
      ticketTask: enrichedPullRequest.ticketTask,
      type: enrichedPullRequest.type,
    });
  }

  for (const groupedEntry of groupedEntries.values()) {
    const prAuthors = dedupeContributors(
      groupedEntry.entries
        .map(entry => formatUser(entry.pullRequest.author))
        .filter(Boolean),
    );

    groupedEntry.otherContributors = dedupeContributors(
      groupedEntry.entries
        .flatMap(entry => entry.otherContributors)
        .filter(contributor => !prAuthors.includes(contributor)),
    );
  }

  return Array.from(groupedEntries.values());
};

const renderManualStep = (manualStep: ManualStep): string[] => {
  return [
    `- [ ] ${manualStep.description}`,
    '   ```bash',
    `   ${manualStep.command.replace(/\n/g, '\n   ')}`,
    '   ```',
  ];
};

export const renderPrDescription = ({
  beforeCoverageBySuite = {},
  enrichedPullRequests,
}: {
  beforeCoverageBySuite?: Partial<Record<CoverageSuite, CoverageSummary>>;
  enrichedPullRequests: EnrichedPullRequest[];
}): string => {
  const lines: string[] = ['### Includes', '', TABLE_HEADER, TABLE_DIVIDER];
  const groupedReleaseEntries = groupEnrichedPullRequests(enrichedPullRequests);

  for (const groupedReleaseEntry of groupedReleaseEntries) {
    lines.push(renderGroupedTableRow(groupedReleaseEntry));
  }

  lines.push(
    '',
    '',
    ...renderCoverageSection({ beforeBySuite: beforeCoverageBySuite }),
  );
  lines.push('', '', '### Manual steps');

  const manualSteps = dedupeManualSteps(
    enrichedPullRequests.flatMap(
      enrichedPullRequest => enrichedPullRequest.manualSteps,
    ),
  );

  if (manualSteps.length === 0) {
    lines.push('');
    return lines.join('\n');
  }

  lines.push('');

  manualSteps.forEach((manualStep: ManualStep, index: number) => {
    lines.push(...renderManualStep(manualStep));

    if (index < manualSteps.length - 1) {
      lines.push('');
    }
  });

  return lines.join('\n');
};

export const enrichPullRequest = ({
  dockerImageTag,
  issue,
  pullRequest,
}: {
  dockerImageTag?: string;
  issue?: GitHubIssue;
  pullRequest: GitHubPullRequest;
}): EnrichedPullRequest => {
  const ticketTask = resolveTicketTask(pullRequest.title);

  return {
    issue,
    manualSteps: resolveManualSteps({ dockerImageTag, pullRequest }),
    otherContributors: resolveOtherContributorList({ issue, pullRequest }),
    pullRequest,
    ticketTask,
    type: resolveType({ issue, pullRequest, ticketTask }),
  };
};

export const generateProdReleasePrDescription = async ({
  circleConfig = readFileSync(CIRCLE_CONFIG_PATH, 'utf8'),
  githubClient,
}: {
  circleConfig?: string;
  githubClient: GitHubClient;
}): Promise<string> => {
  const dockerImageTag = extractDockerImageTag(circleConfig);
  const latestProdPullRequest = await githubClient.getLatestProdPullRequest();
  const pullRequests = await githubClient.listMergedStagingPullRequests(
    latestProdPullRequest.mergedAt,
  );
  const beforeCoverageEntries = await Promise.all(
    COVERAGE_SUITES.map(
      async (suite): Promise<[CoverageSuite, CoverageSummary | undefined]> => {
        const summary = await githubClient.getCoverageSummary(
          latestProdPullRequest.number,
          suite,
        );

        return [suite, summary];
      },
    ),
  );
  const beforeCoverageBySuite = Object.fromEntries(
    beforeCoverageEntries.filter(
      (entry): entry is [CoverageSuite, CoverageSummary] =>
        entry[1] !== undefined,
    ),
  ) as Partial<Record<CoverageSuite, CoverageSummary>>;
  const issueNumbers = dedupeContributors(
    pullRequests
      .map(pullRequest => extractIssueNumberFromTitle(pullRequest.title))
      .filter((issueNumber): issueNumber is number => issueNumber !== undefined)
      .map(issueNumber => issueNumber.toString()),
  ).map(issueNumber => Number(issueNumber));
  const issuesByNumber = new Map<number, GitHubIssue>();

  await Promise.all(
    issueNumbers.map(async (issueNumber: number): Promise<void> => {
      const issue = await githubClient.getIssue(issueNumber);
      issuesByNumber.set(issueNumber, issue);
    }),
  );

  const enrichedPullRequests = pullRequests.map(pullRequest => {
    const issueNumber = extractIssueNumberFromTitle(pullRequest.title);

    return enrichPullRequest({
      dockerImageTag,
      issue: issueNumber ? issuesByNumber.get(issueNumber) : undefined,
      pullRequest,
    });
  });

  return renderPrDescription({
    beforeCoverageBySuite,
    enrichedPullRequests,
  });
};

export { GhCliGitHubClient };

export const prodReleasePrDescription = async ({
  githubClient = new GhCliGitHubClient(),
  write = process.stdout.write.bind(process.stdout),
}: {
  githubClient?: GitHubClient;
  write?: (chunk: string) => boolean;
} = {}): Promise<void> => {
  const description = await generateProdReleasePrDescription({ githubClient });

  write(`${description}\n`);
};
