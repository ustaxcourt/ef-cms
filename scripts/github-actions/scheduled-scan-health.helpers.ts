import { type CommandRunner } from '../git/github-client';
import { DateTime } from 'luxon';
import { runCommand } from '../helpers/runCommand';
import { isoToMillis, toEasternTime } from './eastern-time.helpers';

export const SCHEDULED_SCAN_WORKFLOWS = [
  { file: 'security-containers.yml', name: 'Container scans' },
  { file: 'security-dast.yml', name: 'DAST scan' },
] as const;

export type ScanHealthStatus =
  'failed' | 'in_progress' | 'missing' | 'ok' | 'unknown';

export type ScanHealth = {
  name: string;
  status: ScanHealthStatus;
  url?: string;
};

type WorkflowRun = {
  conclusion: string | null;
  created_at: string;
  html_url: string;
  status: string;
} | null;

export const LATEST_RUN_JQ_FILTER =
  '.workflow_runs[0] | if . == null then null else {status, conclusion, created_at, html_url} end';

const startOfThisMonday = (now: string): DateTime =>
  toEasternTime(now).set({
    hour: 0,
    millisecond: 0,
    minute: 0,
    second: 0,
    weekday: 1,
  });

export const toScanHealth = ({
  name,
  now,
  run,
}: {
  name: string;
  now: string;
  run: WorkflowRun;
}): ScanHealth => {
  if (!run || isoToMillis(run.created_at) < startOfThisMonday(now).toMillis()) {
    return { name, status: 'missing' };
  }
  if (run.status !== 'completed') {
    return { name, status: 'in_progress', url: run.html_url };
  }
  return {
    name,
    status: run.conclusion === 'success' ? 'ok' : 'failed',
    url: run.html_url,
  };
};

export const getScheduledScanHealth = async ({
  commandRunner = runCommand,
  now,
  repo,
}: {
  commandRunner?: CommandRunner;
  now: string;
  repo: string;
}): Promise<ScanHealth[]> =>
  Promise.all(
    SCHEDULED_SCAN_WORKFLOWS.map(
      async ({ file, name }): Promise<ScanHealth> => {
        try {
          const output = await commandRunner(
            'gh',
            [
              'api',
              `repos/${repo}/actions/workflows/${file}/runs?event=schedule&branch=staging&per_page=1`,
              '--jq',
              LATEST_RUN_JQ_FILTER,
            ],
            { GH_PAGER: 'cat', PAGER: 'cat' },
          );
          const run: WorkflowRun = JSON.parse(output || 'null');
          return toScanHealth({ name, now, run });
        } catch {
          return { name, status: 'unknown' };
        }
      },
    ),
  );
