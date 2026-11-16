import {
  type AlertWindow,
  type NewFinding,
  type ScanHealth,
  type ScanHealthStatus,
  type Scanner,
  type Severity,
  toMillis,
} from './security-weekly-summary.helpers';
import { DateTime } from 'luxon';
import { FORMATS, USTC_TZ } from '@shared/business/utilities/DateHandler';

export const isListedInTable = (finding: NewFinding): boolean =>
  finding.severity === 'Critical' || finding.severity === 'High';

export const SEVERITY_ORDER: Severity[] = ['Critical', 'High', 'Medium', 'Low'];

const SCANNER_NAMES: Record<Scanner, string> = {
  checkov: 'Checkov',
  codeql: 'CodeQL',
  gitleaks: 'Gitleaks',
  semgrep: 'Semgrep',
  trivy: 'Trivy',
  unknown: 'Unknown',
};

const HEALTH_MESSAGES: Record<Exclude<ScanHealthStatus, 'ok'>, string> = {
  failed: 'failed',
  in_progress: 'was still running',
  missing: 'did not run this week',
  unknown: 'could not be checked',
};

export const FOOTNOTE =
  "Severity is the scanner's; the DAWSON severity is set at triage. " +
  'ZAP (DAST) findings are not included yet. ' +
  'trivy-config results only update after the manual Monday run.';

export const DEFAULT_MAX_BYTES = 24_000;
export const DEFAULT_MAX_ROWS = 25;

export const escapeMarkdown = (text: string): string =>
  text.replace(/[\\`*[\]]/g, character => `\\${character}`);

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

const findingRow = (finding: NewFinding): Record<string, unknown> =>
  tableRow([
    textBlock(finding.severity, {
      color: SEVERITY_COLORS[finding.severity],
      weight: 'Bolder',
    }),
    textBlock(SCANNER_NAMES[finding.scanner]),
    textBlock(escapeMarkdown(finding.ruleId)),
    textBlock(formatEastern(finding.createdAt, FORMATS.MD)),
    textBlock(`[#${finding.number}](${finding.url})`),
  ]);

const HEADER_ROW = tableRow(
  ['Severity', 'Scanner', 'Rule', 'First seen', 'Alert'].map(text =>
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
  const listed = findings
    .filter(isListedInTable)
    .sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity) -
          SEVERITY_ORDER.indexOf(b.severity) ||
        toMillis(a.createdAt) - toMillis(b.createdAt),
    );

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
        `**New findings since ${formatEastern(window.since, FORMATS.DATE_TIME_TZ)}: ${findings.length}**`,
        { spacing: 'Medium' },
      ),
    ];

    if (findings.length === 0) {
      body.push(textBlock('No new findings this week.'));
    } else {
      body.push(
        textBlock(
          SEVERITY_ORDER.map(
            severity =>
              `${severity} ${findings.filter(f => f.severity === severity).length}`,
          ).join(' · '),
        ),
      );
      if (listed.length === 0) {
        body.push(textBlock('No new High or Critical findings.'));
      } else {
        body.push({
          columns: [1, 1, 3, 1, 1].map(width => ({ width })),
          firstRowAsHeaders: true,
          rows: [HEADER_ROW, ...listed.slice(0, rowCount).map(findingRow)],
          showGridLines: true,
          spacing: 'Medium',
          type: 'Table',
        });
        const hidden = listed.length - rowCount;
        if (hidden > 0) {
          body.push(
            textBlock(
              `…and ${hidden} more High or Critical finding${hidden === 1 ? '' : 's'} on the dashboard.`,
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
