import { type CommandRunner } from '../git/github-client';
import {
  type SummaryCard,
  buildSummaryCard,
} from './security-weekly-summary-card.helpers';
import {
  getTriageWindow,
  listNewFindings,
} from './code-scanning-alerts.helpers';
import { getScheduledScanHealth } from './scheduled-scan-health.helpers';
import { runCommand } from '../helpers/runCommand';

export const TEAMS_TIMEOUT_MS = 30_000;
export const DEFAULT_REPO = 'ustaxcourt/ef-cms';

export type FetchFn = (
  url: string,
  init: {
    body: string;
    headers: Record<string, string>;
    method: 'POST';
    signal: AbortSignal;
  },
) => Promise<{ ok: boolean; status: number }>;

export type SummaryEnv = {
  GITHUB_ACTIONS?: string;
  GITHUB_REPOSITORY?: string;
  RUN_URL?: string;
  SINCE?: string;
  TEAMS_WEBHOOK_URL?: string;
};

export const securityDashboardUrl = (repo: string): string =>
  `https://github.com/${repo}/security/code-scanning?query=is%3Aopen+branch%3Astaging`;

const requireHttpsWebhookUrl = (url: string | undefined): string => {
  if (!url?.startsWith('https://')) {
    throw new Error('TEAMS_WEBHOOK_URL must be set to an https URL');
  }
  return url;
};

export const postToTeams = async ({
  fetchFn = fetch,
  payload,
  webhookUrl,
}: {
  fetchFn?: FetchFn;
  payload: SummaryCard;
  webhookUrl: string;
}): Promise<number> => {
  let response: { ok: boolean; status: number };
  try {
    response = await fetchFn(webhookUrl, {
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      signal: AbortSignal.timeout(TEAMS_TIMEOUT_MS),
    });
  } catch {
    throw new Error('Teams webhook request failed before a response');
  }
  if (!response.ok) {
    throw new Error(`Teams webhook returned HTTP ${response.status}`);
  }
  return response.status;
};

export const runWeeklySummary = async ({
  commandRunner = runCommand,
  dryRun = false,
  env,
  fetchFn = fetch,
  log = console.log,
  now,
  print = console.log,
}: {
  commandRunner?: CommandRunner;
  dryRun?: boolean;
  env: SummaryEnv;
  fetchFn?: FetchFn;
  log?: (message: string) => void;
  now: string;
  print?: (output: string) => void;
}): Promise<void> => {
  if (dryRun && env.GITHUB_ACTIONS === 'true') {
    throw new Error(
      '--dry-run prints findings, so it is not allowed in GitHub Actions (logs are public)',
    );
  }
  const webhookUrl = dryRun
    ? undefined
    : requireHttpsWebhookUrl(env.TEAMS_WEBHOOK_URL);

  const repo = env.GITHUB_REPOSITORY || DEFAULT_REPO;
  const window = getTriageWindow({ now, since: env.SINCE || undefined });
  const [findings, health] = await Promise.all([
    listNewFindings({ commandRunner, repo, window }),
    getScheduledScanHealth({ commandRunner, now, repo }),
  ]);
  const payload = buildSummaryCard({
    dashboardUrl: securityDashboardUrl(repo),
    findings,
    health,
    runUrl: env.RUN_URL || undefined,
    window,
  });

  if (webhookUrl === undefined) {
    print(JSON.stringify(payload, null, 2));
    return;
  }

  const status = await postToTeams({ fetchFn, payload, webhookUrl });
  log(`Posted the weekly security summary (HTTP ${status}).`);
};
