import {
  type AlertWindow,
  type NewFinding,
  type Scanner,
  type Severity,
} from './code-scanning-alerts.helpers';
import {
  type ScanHealth,
  type ScanHealthStatus,
} from './scheduled-scan-health.helpers';
import { DateTime } from 'luxon';
import { FORMATS, USTC_TZ } from '@shared/business/utilities/DateHandler';

export type RuleGroup = {
  alertCount: number;
  categories: string[];
  firstUrl: string;
  ruleId: string;
  scanner: Scanner;
  severity: Severity;
};

export const isListedInTable = (group: { severity: Severity }): boolean =>
  group.severity === 'Critical' || group.severity === 'High';

export const SEVERITY_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

const severityRank = (severity: Severity): number =>
  SEVERITY_ORDER.indexOf(severity);

const SCANNER_NAMES: Record<Scanner, string> = {
  checkov: 'Checkov',
  codeql: 'CodeQL',
  gitleaks: 'Gitleaks',
  semgrep: 'Semgrep',
  trivy: 'Trivy',
  unknown: 'Unknown',
};

const TRIVY_LOCATIONS: Record<string, string> = {
  trivy: 'repo',
  'trivy-baseline-base': 'base',
  'trivy-baseline-batch': 'batch',
  'trivy-baseline-puppeteer': 'puppeteer',
  'trivy-config': 'config',
};

const HEALTH_MESSAGES: Record<Exclude<ScanHealthStatus, 'ok'>, string> = {
  failed: 'failed',
  in_progress: 'was still running',
  missing: 'did not run this week',
  unknown: 'could not be checked',
};

export const FOOTNOTE =
  "Severity is the scanner's; the DAWSON severity is set at triage. " +
  'One row per rule; Alerts counts how many places it was found. ' +
  'ZAP (DAST) findings are not included yet. ' +
  'trivy-config results only update after the manual Monday run.';

export const DEFAULT_MAX_BYTES = 24_000;
export const DEFAULT_MAX_ROWS = 25;

export const groupByRule = (findings: NewFinding[]): RuleGroup[] => {
  const groups = new Map<string, RuleGroup>();
  for (const finding of findings) {
    const key = `${finding.scanner}|${finding.ruleId}`;
    const group = groups.get(key);
    if (!group) {
      groups.set(key, {
        alertCount: 1,
        categories: [finding.category],
        firstUrl: finding.url,
        ruleId: finding.ruleId,
        scanner: finding.scanner,
        severity: finding.severity,
      });
      continue;
    }
    group.alertCount += 1;
    if (!group.categories.includes(finding.category)) {
      group.categories.push(finding.category);
    }
    if (severityRank(finding.severity) < severityRank(group.severity)) {
      group.severity = finding.severity;
    }
  }
  return [...groups.values()].sort(
    (a, b) =>
      severityRank(a.severity) - severityRank(b.severity) ||
      b.alertCount - a.alertCount ||
      a.ruleId.localeCompare(b.ruleId),
  );
};

export const whereFound = (group: RuleGroup): string =>
  group.scanner === 'trivy'
    ? `Trivy: ${group.categories
        .map(category => TRIVY_LOCATIONS[category] ?? category)
        .sort()
        .join(', ')}`
    : SCANNER_NAMES[group.scanner];

export const ruleLink = (group: RuleGroup): string => {
  if (group.alertCount === 1) {
    return group.firstUrl;
  }
  const rule = encodeURIComponent(group.ruleId).replace(
    /[()]/g,
    character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `${group.firstUrl.replace(/\/\d+$/, '')}?query=is%3Aopen+branch%3Astaging+rule%3A${rule}`;
};

export const escapeMarkdown = (text: string): string =>
  text.replace(/[\\`*[\]]/g, character => `\\${character}`);

const plural = (count: number, word: string): string =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

const formatEastern = (isoDateTime: string, format: string): string =>
  DateTime.fromISO(isoDateTime, { zone: 'utc' })
    .setZone(USTC_TZ)
    .toFormat(format);

const textBlock = (
  text: string,
  options: Record<string, unknown> = {},
): Record<string, unknown> => ({
  text,
  type: 'TextBlock',
  wrap: true,
  ...options,
});

const tableRow = (
  cells: Record<string, unknown>[],
  options: Record<string, unknown> = {},
): Record<string, unknown> => ({
  cells: cells.map(item => ({ items: [item], type: 'TableCell' })),
  type: 'TableRow',
  ...options,
});

const SEVERITY_COLORS: Partial<Record<Severity, string>> = {
  Critical: 'Attention',
  High: 'Warning',
};

const groupRow = (group: RuleGroup): Record<string, unknown> =>
  tableRow([
    textBlock(group.severity, {
      color: SEVERITY_COLORS[group.severity],
      weight: 'Bolder',
    }),
    textBlock(`[${escapeMarkdown(group.ruleId)}](${ruleLink(group)})`),
    textBlock(String(group.alertCount)),
    textBlock(whereFound(group)),
  ]);

const HEADER_ROW = tableRow(
  ['Severity', 'Rule', 'Alerts', 'Where'].map(text =>
    textBlock(text, { weight: 'Bolder' }),
  ),
  { style: 'accent' },
);

export type SummaryCard = {
  attachments: {
    content: Record<string, unknown>;
    contentType: 'application/vnd.microsoft.card.adaptive';
  }[];
  type: 'message';
};

export const payloadBytes = (payload: SummaryCard): number =>
  Buffer.byteLength(JSON.stringify(payload), 'utf-8');

export const buildSummaryCard = ({
  dashboardUrl,
  findings,
  health,
  maxBytes = DEFAULT_MAX_BYTES,
  maxRows = DEFAULT_MAX_ROWS,
  runUrl,
  window,
}: {
  dashboardUrl: string;
  findings: NewFinding[];
  health: ScanHealth[];
  maxBytes?: number;
  maxRows?: number;
  runUrl?: string;
  window: AlertWindow;
}): SummaryCard => {
  const groups = groupByRule(findings);
  const listed = groups.filter(isListedInTable);
  const since = formatEastern(window.since, FORMATS.DATE_TIME_TZ);

  const build = (rowCount: number): SummaryCard => {
    const body: Record<string, unknown>[] = [
      textBlock(
        `Weekly security summary: ${formatEastern(window.until, FORMATS.SHORT_MONTH_DAY_YEAR)}`,
        { size: 'Large', weight: 'Bolder' },
      ),
      ...health
        .filter(scan => scan.status !== 'ok')
        .map(scan =>
          textBlock(
            `⚠️ ${scan.name} ${HEALTH_MESSAGES[scan.status as Exclude<ScanHealthStatus, 'ok'>]}` +
              (scan.url ? ` ([view run](${scan.url}))` : '') +
              '. Counts below may be incomplete.',
            { color: 'Warning' },
          ),
        ),
      textBlock(
        findings.length === 0
          ? `**New findings since ${since}: 0**`
          : `**New findings since ${since}: ${plural(findings.length, 'alert')} (${plural(groups.length, 'rule')})**`,
        { spacing: 'Medium' },
      ),
    ];

    if (findings.length === 0) {
      body.push(textBlock('No new findings this week.'));
    } else {
      body.push(
        textBlock(
          `Alerts by severity: ${SEVERITY_ORDER.map(
            severity =>
              `${severity} ${findings.filter(f => f.severity === severity).length}`,
          ).join(' · ')}`,
        ),
      );
      if (listed.length === 0) {
        body.push(textBlock('No new High or Critical findings.'));
      } else {
        if (rowCount > 0) {
          body.push({
            columns: [1, 3, 1, 2].map(width => ({ width })),
            firstRowAsHeaders: true,
            rows: [HEADER_ROW, ...listed.slice(0, rowCount).map(groupRow)],
            showGridLines: true,
            spacing: 'Medium',
            type: 'Table',
          });
        }
        const hidden = listed.slice(rowCount);
        if (hidden.length > 0) {
          const hiddenAlerts = hidden.reduce(
            (total, group) => total + group.alertCount,
            0,
          );
          body.push(
            textBlock(
              `…and ${plural(hidden.length, 'more High or Critical rule')} (${plural(hiddenAlerts, 'alert')}) on the dashboard.`,
            ),
          );
        }
      }
    }

    body.push(
      textBlock(FOOTNOTE, { isSubtle: true, size: 'Small', spacing: 'Medium' }),
    );

    return {
      attachments: [
        {
          content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            actions: [
              {
                title: 'Open dashboard',
                type: 'Action.OpenUrl',
                url: dashboardUrl,
              },
              ...(runUrl
                ? [{ title: 'View run', type: 'Action.OpenUrl', url: runUrl }]
                : []),
            ],
            body,
            msteams: { width: 'Full' },
            type: 'AdaptiveCard',
            version: '1.5',
          },
          contentType: 'application/vnd.microsoft.card.adaptive',
        },
      ],
      type: 'message',
    };
  };

  let rowCount = Math.min(listed.length, maxRows);
  let card = build(rowCount);
  while (rowCount > 0 && payloadBytes(card) > maxBytes) {
    rowCount -= 1;
    card = build(rowCount);
  }
  return card;
};
