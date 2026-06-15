import {
  type GitHubClient,
  type GitHubPullRequest,
  type GitHubStatusCheck,
} from './github-client';
import {
  FORMATS,
  formatDateString,
  prepareDateFromString,
} from '@shared/business/utilities/DateHandler';

export const extractCircleCiUrl = (pullRequest: GitHubPullRequest): string => {
  const checks = pullRequest.statusCheckRollup ?? [];
  const deployCheck = checks.find(
    check => check.context === 'ci/circleci: deploy',
  );
  if (deployCheck && deployCheck.targetUrl) {
    return deployCheck.targetUrl;
  }
  return '<INSERT_CIRCLECI_URL>';
};

export const hasDataMigration = (pullRequest: GitHubPullRequest): boolean => {
  return pullRequest.labels.some(
    label => label.name.trim().toLowerCase() === 'data migration',
  );
};

export const hasManualSteps = (pullRequest: GitHubPullRequest): boolean => {
  return pullRequest.labels.some(
    label =>
      label.name.trim().toLowerCase() === 'manual deploy step(s) required',
  );
};

const CIRCLE_CI_STEP_DURATION_THRESHOLD_SECONDS = 30;

type CircleCiMigrationAction = {
  end_time?: string;
  start_time?: string;
};

type CircleCiMigrationStep = {
  actions?: CircleCiMigrationAction[];
  name?: string;
};

type CircleCiMigrationResponse = {
  steps?: CircleCiMigrationStep[];
};

type CircleCiStepTimings = {
  durationInSeconds: number;
  endTime: string;
  startTime: string;
};

const getCircleCiStepTimings = async (
  jobUrl: string,
  stepName: string,
): Promise<CircleCiStepTimings | undefined> => {
  const match = jobUrl.match(/circleci\.com\/gh\/ustaxcourt\/ef-cms\/(\d+)/);
  if (!match) return undefined;
  const jobNumber = match[1];

  try {
    const response = await fetch(
      `https://circleci.com/api/v1.1/project/github/ustaxcourt/ef-cms/${jobNumber}`,
    );
    if (!response.ok) return undefined;
    const data: CircleCiMigrationResponse = await response.json();

    const steps = data.steps || [];
    for (const step of steps) {
      if (step.name === stepName) {
        const action = step.actions?.[0];
        if (action?.start_time && action?.end_time) {
          const startTimestamp = prepareDateFromString(
            action.start_time,
            FORMATS.ISO,
          ).toMillis();
          const endTimestamp = prepareDateFromString(
            action.end_time,
            FORMATS.ISO,
          ).toMillis();

          if (
            Number.isFinite(startTimestamp) &&
            Number.isFinite(endTimestamp)
          ) {
            return {
              durationInSeconds: (endTimestamp - startTimestamp) / 1000,
              endTime: action.end_time,
              startTime: action.start_time,
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn(`Error fetching ${stepName.toLowerCase()} timings: ${err}`);
  }
  return undefined;
};

export const getPostgresMigrationTimings = async (
  jobUrl: string,
): Promise<{ startTime: string; endTime: string } | undefined> => {
  const timings = await getCircleCiStepTimings(
    jobUrl,
    'Run Postgres Migration',
  );

  if (!timings) return undefined;

  return {
    endTime: timings.endTime,
    startTime: timings.startTime,
  };
};

const getTimelineEvents = async (
  pr: GitHubPullRequest,
  mergeStatusChecks: GitHubStatusCheck[],
): Promise<TimelineEvent[]> => {
  const events: TimelineEvent[] = [];
  const prUrl = `https://github.com/ustaxcourt/ef-cms/pull/${pr.number}`;

  events.push({
    dateStr: formatDateString(pr.createdAt, FORMATS.YYYYMMDD),
    desc: `Created the [Pull Request](${prUrl})`,
    timeStr: formatDateString(pr.createdAt, FORMATS.TIME_24_HOUR),
  });

  if (pr.mergedAt) {
    let deployUrl = mergeStatusChecks.find(
      c => c.context === 'ci/circleci: deploy',
    )?.targetUrl;
    if (!deployUrl) deployUrl = extractCircleCiUrl(pr);

    events.push({
      dateStr: formatDateString(pr.mergedAt, FORMATS.YYYYMMDD),
      desc: `Merged the PR [CircleCI Build](${deployUrl})`,
      timeStr: formatDateString(pr.mergedAt, FORMATS.TIME_24_HOUR),
    });
  }

  const migrateCheck = mergeStatusChecks.find(
    c => c.context === 'ci/circleci: migrate',
  );
  const migrationStepTimings = migrateCheck?.targetUrl
    ? await getCircleCiStepTimings(
        migrateCheck.targetUrl,
        'Run Postgres Migration',
      )
    : undefined;

  if (
    migrationStepTimings &&
    (hasDataMigration(pr) ||
      migrationStepTimings.durationInSeconds >=
        CIRCLE_CI_STEP_DURATION_THRESHOLD_SECONDS)
  ) {
    events.push({
      dateStr: formatDateString(
        migrationStepTimings.startTime,
        FORMATS.YYYYMMDD,
      ),
      desc: 'Data migration begins',
      timeStr: formatDateString(
        migrationStepTimings.startTime,
        FORMATS.TIME_24_HOUR,
      ),
    });
    events.push({
      dateStr: formatDateString(migrationStepTimings.endTime, FORMATS.YYYYMMDD),
      desc: 'Data migration completes',
      timeStr: formatDateString(
        migrationStepTimings.endTime,
        FORMATS.TIME_24_HOUR,
      ),
    });
  }

  const entityValidationCheck = mergeStatusChecks.find(
    c => c.context === 'ci/circleci: validate-entities',
  );
  const entityValidationStepTimings = entityValidationCheck?.targetUrl
    ? await getCircleCiStepTimings(
        entityValidationCheck.targetUrl,
        'Run Entity Validation',
      )
    : undefined;

  if (
    entityValidationStepTimings &&
    entityValidationStepTimings.durationInSeconds >=
      CIRCLE_CI_STEP_DURATION_THRESHOLD_SECONDS
  ) {
    events.push({
      dateStr: formatDateString(
        entityValidationStepTimings.startTime,
        FORMATS.YYYYMMDD,
      ),
      desc: 'Entity validation begins',
      timeStr: formatDateString(
        entityValidationStepTimings.startTime,
        FORMATS.TIME_24_HOUR,
      ),
    });
    events.push({
      dateStr: formatDateString(
        entityValidationStepTimings.endTime,
        FORMATS.YYYYMMDD,
      ),
      desc: 'Entity validation completes',
      timeStr: formatDateString(
        entityValidationStepTimings.endTime,
        FORMATS.TIME_24_HOUR,
      ),
    });
  }

  const stepMappings: Record<string, string> = {
    'ci/circleci: build-and-deploy-to-prod/wait-for-switch':
      'Wait for color switch step reached and manually approved',
    'ci/circleci: cleanup': 'Cleanup step completes',
    'ci/circleci: deploy': 'Deploy step completes',
    'ci/circleci: loadtests': 'Load tests pass',
    'ci/circleci: smoketests-readonly': 'Read-only smoketests pass',
    'ci/circleci: switch-colors': 'Switched colors',
  };

  const relevantChecks = mergeStatusChecks
    .filter((check): check is GitHubStatusCheck & { createdAt: string } =>
      Boolean(stepMappings[check.context] && check.createdAt),
    )
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  for (const check of relevantChecks) {
    events.push({
      dateStr: formatDateString(check.createdAt, FORMATS.YYYYMMDD),
      desc: stepMappings[check.context],
      timeStr: formatDateString(check.createdAt, FORMATS.TIME_24_HOUR),
    });
  }

  return events;
};
const parsePullRequestBody = (
  body: string,
): { bugFixes: string[]; stories: string[] } => {
  const stories: string[] = [];
  const bugFixes: string[] = [];
  const tableLinePattern = /^\|\s*(#[0-9]+)\s*\|\s*([a-zA-Z0-9_-]+)\s*\|/i;

  for (const line of body.split('\n')) {
    const match = line.match(tableLinePattern);
    if (match) {
      const task = match[1].trim();
      const type = match[2].trim().toLowerCase();
      const issueUrl = `https://github.com/ustaxcourt/ef-cms/issues/${task.replace('#', '')}`;

      if (type === 'bugfix' && !bugFixes.includes(issueUrl)) {
        bugFixes.push(issueUrl);
      } else if (type === 'story' && !stories.includes(issueUrl)) {
        stories.push(issueUrl);
      }
    }
  }

  return { bugFixes, stories };
};

type TimelineEvent = { dateStr: string; timeStr: string; desc: string };

const renderTimeline = (events: TimelineEvent[]): string[] => {
  const lines: string[] = [];
  type TimelineMap = Record<string, Array<{ desc: string; timeStr: string }>>;

  const groupedTimeline = events.reduce((acc: TimelineMap, event) => {
    if (!acc[event.dateStr]) acc[event.dateStr] = [];
    acc[event.dateStr].push({ desc: event.desc, timeStr: event.timeStr });
    return acc;
  }, {});

  const dates = Object.keys(groupedTimeline).sort();
  for (let i = 0; i < dates.length; i++) {
    lines.push(`(${dates[i]})`);
    const dailyEvents = groupedTimeline[dates[i]].sort((a, b) =>
      a.timeStr.localeCompare(b.timeStr),
    );
    for (const event of dailyEvents) {
      lines.push(`- ${event.timeStr} - ${event.desc}`);
    }
    if (i < dates.length - 1) {
      lines.push('');
    }
  }
  return lines;
};

export const generateWikiSummary = async (
  githubClient: GitHubClient,
  pullRequestNumber?: number,
): Promise<string> => {
  const prNumber =
    pullRequestNumber ?? (await githubClient.getLatestProdPullRequest()).number;
  const pr = await githubClient.getPullRequest(prNumber);

  let mergeStatusChecks: GitHubStatusCheck[] = [];
  if (pr.mergeCommit?.oid) {
    mergeStatusChecks = await githubClient.getMergeCommitStatusContexts(
      pr.mergeCommit.oid,
    );
  }

  const { bugFixes, stories } = parsePullRequestBody(pr.body);

  const lines: string[] = [];
  lines.push('## General Notes');
  lines.push(
    'This deployment contains the latest assortment of work from Flexion and Gunnison. See the [bug fixes](#bug-fixes) and [stories](#feature-stories) below.',
  );

  if (hasManualSteps(pr)) {
    lines.push('');
    lines.push(
      '**Note:** This deployment includes manual steps. See the PR for details.',
    );
  }

  lines.push('');
  lines.push('### Feature Stories');
  if (stories.length > 0) {
    stories.forEach(url => lines.push(`- ${url}`));
  } else {
    lines.push('None');
  }

  lines.push('');
  lines.push('### Bug Fixes');
  if (bugFixes.length > 0) {
    bugFixes.forEach(url => lines.push(`- ${url}`));
  } else {
    lines.push('None');
  }

  lines.push('');
  lines.push('### Observations');
  lines.push('');

  lines.push('### Timeline');

  const timelineEvents = await getTimelineEvents(pr, mergeStatusChecks);
  lines.push(...renderTimeline(timelineEvents));

  return lines.join('\n');
};
