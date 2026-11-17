import { type CommandRunner } from '../git/github-client';
import { DateTime } from 'luxon';
import { USTC_TZ } from '@shared/business/utilities/DateHandler';
import { runCommand } from '../helpers/runCommand';

export type AlertWindow = { since: string; until: string };

export const computeWindow = ({
  now,
  since,
}: {
  now: string;
  since?: string;
}): AlertWindow => {
  const nowEastern = toEastern(now);

  if (since) {
    const start = DateTime.fromISO(since, { zone: USTC_TZ });
    if (!start.isValid) {
      throw new Error(
        `SINCE must be an ISO date such as 2026-11-09 (got "${since}")`,
      );
    }
    if (start >= nowEastern) {
      throw new Error('SINCE must be in the past');
    }
    return { since: toUtcIso(start), until: toUtcIso(nowEastern) };
  }

  let until = nowEastern.set({
    hour: 7,
    millisecond: 0,
    minute: 0,
    second: 0,
    weekday: 1,
  });
  if (until > nowEastern) {
    until = until.minus({ weeks: 1 });
  }
  return {
    since: toUtcIso(until.minus({ weeks: 1 })),
    until: toUtcIso(until),
  };
};

export const toEastern = (isoDateTime: string): DateTime =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' }).setZone(USTC_TZ);

const toUtcIso = (dateTime: DateTime): string =>
  dateTime.toUTC().toISO() as string;

export const toMillis = (isoDateTime: string): number =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' }).toMillis();

export const TRIAGED_CATEGORY_PATTERN =
  /^(trivy-baseline-(base|puppeteer|batch)|trivy|trivy-config|semgrep|checkov|\/language:.*|gitleaks-baseline)$/;

export const CHECKOV_HARD_FAIL_CHECKS = [
  'CKV_AWS_57',
  'CKV_AWS_20',
  'CKV_AWS_23',
  'CKV_AWS_7',
];

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export type Scanner =
  'checkov' | 'codeql' | 'gitleaks' | 'semgrep' | 'trivy' | 'unknown';

export type CodeScanningAlert = {
  category: string | null;
  created_at: string;
  html_url: string;
  number: number;
  rule: {
    id: string | null;
    security_severity_level: string | null;
    severity: string | null;
    tags: string[] | null;
  };
};

export type NewFinding = {
  category: string;
  createdAt: string;
  number: number;
  ruleId: string;
  scanner: Scanner;
  severity: Severity;
  url: string;
};

export const ALERTS_PER_PAGE = 100;

export const ALERT_JQ_FILTER =
  '.[] | {number, created_at, html_url, category: .most_recent_instance.category, rule: {id: .rule.id, severity: .rule.severity, security_severity_level: .rule.security_severity_level, tags: .rule.tags}} | @json';

export const listAlertsInWindow = async ({
  commandRunner = runCommand,
  maxPages = 100,
  repo,
  window,
}: {
  commandRunner?: CommandRunner;
  maxPages?: number;
  repo: string;
  window: AlertWindow;
}): Promise<CodeScanningAlert[]> => {
  const since = toMillis(window.since);
  const until = toMillis(window.until);
  const alerts: CodeScanningAlert[] = [];

  for (let page = 1; page <= maxPages; page++) {
    const output = await commandRunner(
      'gh',
      [
        'api',
        `repos/${repo}/code-scanning/alerts?state=open&ref=refs/heads/staging&sort=created&direction=desc&per_page=${ALERTS_PER_PAGE}&page=${page}`,
        '--jq',
        ALERT_JQ_FILTER,
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
    const pageAlerts = parseAlertLines(output);

    for (const alert of pageAlerts) {
      const createdAt = toMillis(alert.created_at);
      if (createdAt >= since && createdAt < until) {
        alerts.push(alert);
      }
    }

    if (
      pageAlerts.length < ALERTS_PER_PAGE ||
      toMillis(pageAlerts[pageAlerts.length - 1].created_at) < since
    ) {
      return alerts;
    }
  }

  throw new Error(
    `Stopped after ${maxPages} pages of alerts without reaching the start of the window`,
  );
};

export const parseAlertLines = (output: string): CodeScanningAlert[] =>
  output
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => JSON.parse(line) as CodeScanningAlert);

export const scannerForCategory = (category: string | null): Scanner => {
  if (!category) {
    return 'unknown';
  }
  if (category.startsWith('/language:')) {
    return 'codeql';
  }
  if (category.startsWith('trivy')) {
    return 'trivy';
  }
  if (category.startsWith('gitleaks')) {
    return 'gitleaks';
  }
  if (category === 'semgrep') {
    return 'semgrep';
  }
  if (category === 'checkov') {
    return 'checkov';
  }
  return 'unknown';
};

export const isTriaged = (alert: CodeScanningAlert): boolean => {
  if (!alert.category || !TRIAGED_CATEGORY_PATTERN.test(alert.category)) {
    return false;
  }
  return !(
    scannerForCategory(alert.category) === 'codeql' &&
    alert.rule.security_severity_level === null
  );
};

const LEVELS: Record<string, Severity> = {
  critical: 'Critical',
  high: 'High',
  low: 'Low',
  medium: 'Medium',
};

const fromLevel = (level: string | null | undefined): Severity | undefined =>
  level ? LEVELS[level.toLowerCase()] : undefined;

const SEMGREP_LEVELS: Record<string, Severity> = {
  error: 'High',
  note: 'Low',
  warning: 'Medium',
};

export const toScannerSeverity = (alert: CodeScanningAlert): Severity => {
  const { rule } = alert;

  switch (scannerForCategory(alert.category)) {
    case 'gitleaks':
      return 'Critical';
    case 'checkov':
      return rule.id && CHECKOV_HARD_FAIL_CHECKS.includes(rule.id)
        ? 'High'
        : 'Medium';
    case 'semgrep':
      return SEMGREP_LEVELS[rule.severity?.toLowerCase() ?? ''] ?? 'Low';
    case 'trivy': {
      const tagged = (rule.tags ?? []).map(tag => fromLevel(tag)).find(Boolean);
      return tagged ?? fromLevel(rule.security_severity_level) ?? 'High';
    }
    case 'codeql': {
      const level = fromLevel(rule.security_severity_level);
      if (!level) {
        throw new Error(
          'A CodeQL alert has no security severity; filter alerts with isTriaged first',
        );
      }
      return level;
    }
    case 'unknown':
      throw new Error(
        `No severity rule for category "${alert.category ?? '(none)'}"; add one before triaging it`,
      );
  }
};

export const toNewFinding = (alert: CodeScanningAlert): NewFinding => {
  const severity = toScannerSeverity(alert);
  return {
    category: alert.category as string,
    createdAt: alert.created_at,
    number: alert.number,
    ruleId: alert.rule.id ?? '(none)',
    scanner: scannerForCategory(alert.category),
    severity,
    url: alert.html_url,
  };
};

export const listNewFindings = async (options: {
  commandRunner?: CommandRunner;
  maxPages?: number;
  repo: string;
  window: AlertWindow;
}): Promise<NewFinding[]> =>
  (await listAlertsInWindow(options)).filter(isTriaged).map(toNewFinding);
