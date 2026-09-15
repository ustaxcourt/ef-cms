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
import { haveValidationRulesChanged } from '../entity-validation/entityValidation';
import {
  dedupeManualSteps,
  extractBashCodeBlocks,
  extractManualSteps,
  renderManualSteps,
  type ManualStep,
  type ManualStepSection,
} from './prod-release-pr-description.manual-steps-helpers';

export { extractBashCodeBlocks };
export type { ManualStep, ManualStepSection };

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

const DEPENDENCIES_PATTERN = /\b(?:dependencies|dependency|deps|dep)\b/i;
const DEVEX_PATTERN = /^devex\b/i;
const ISSUE_NUMBER_PATTERN = /^(\d+)\b/;
const MERGE_COMMIT_PATTERN = /^Merge\b/;
const OPEX_PATTERN = /^opex\b/i;
const BUG_DESCRIPTION_HEADING_PATTERN = /^[\s*_#>~-]*describe the bug\b/i;
const BUG_LABEL = 'bug';
const BUGFIX_LABEL = 'bugfix';
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

const normalizeLabelName = (label: GitHubLabel): string => {
  return label.name.trim().toLowerCase();
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

const hasDockerfileChange = (pullRequest: GitHubPullRequest): boolean => {
  return (
    pullRequest.files?.some(
      (file: GitHubPullRequestFile): boolean => file.path === 'Dockerfile',
    ) ?? false
  );
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
    const dockerCheckAlreadyIncluded = manualSteps.some(
      manualStep =>
        manualStep.command === 'npm run ecr:check-version' &&
        (manualStep.section === undefined || manualStep.section === 'before'),
    );

    if (!dockerCheckAlreadyIncluded) {
      manualSteps.push({
        command: 'npm run ecr:check-version',
        description: dockerImageTag
          ? `docker container \`${dockerImageTag}\``
          : 'docker container',
        section: 'before',
      });
    }
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

const hasDataMigrationChange = (pullRequest: GitHubPullRequest): boolean => {
  return (
    pullRequest.files?.some(
      (file: GitHubPullRequestFile): boolean =>
        file.path.startsWith(
          'web-api/src/persistence/postgres/utils/migrate/migrations/',
        ) &&
        !file.path.startsWith(
          'web-api/src/persistence/postgres/utils/migrate/migrations/deprecated/',
        ),
    ) ?? false
  );
};

const resolveSuggestedLabels = ({
  enrichedPullRequests,
  manualSteps,
  validationRulesUpdated,
}: {
  enrichedPullRequests: EnrichedPullRequest[];
  manualSteps: ManualStep[];
  validationRulesUpdated: boolean;
}): string[] => {
  const suggestedLabels: string[] = [];

  if (manualSteps.length > 0) {
    suggestedLabels.push('Manual Deploy Step(s) Required');

    if (
      manualSteps.some(step =>
        step.command.includes('npm run deploy:account-specific'),
      )
    ) {
      suggestedLabels.push('Needs Account Specific');
    }
  }

  for (const enriched of enrichedPullRequests) {
    if (hasDataMigrationChange(enriched.pullRequest)) {
      suggestedLabels.push('Data Migration');
    }
  }

  if (validationRulesUpdated) {
    suggestedLabels.push('Validation Rules Updated');
  }

  return suggestedLabels;
};

export const renderPrDescription = ({
  beforeCoverageBySuite = {},
  enrichedPullRequests,
  validationRulesUpdated = false,
}: {
  beforeCoverageBySuite?: Partial<Record<CoverageSuite, CoverageSummary>>;
  enrichedPullRequests: EnrichedPullRequest[];
  validationRulesUpdated?: boolean;
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

  const manualSteps = dedupeManualSteps(
    enrichedPullRequests.flatMap(
      enrichedPullRequest => enrichedPullRequest.manualSteps,
    ),
  );

  const suggestedLabels = resolveSuggestedLabels({
    enrichedPullRequests,
    manualSteps,
    validationRulesUpdated,
  });

  lines.push('', '', '### Manual steps');

  if (manualSteps.length === 0) {
    lines.push('');
  } else {
    lines.push('', ...renderManualSteps(manualSteps));
  }

  if (suggestedLabels.length > 0) {
    lines.push('', '### Suggested labels', '');
    for (const label of suggestedLabels) {
      lines.push(`- \`${label}\``);
    }
  }

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

  const validationRulesUpdated = await haveValidationRulesChanged();

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
    validationRulesUpdated,
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
