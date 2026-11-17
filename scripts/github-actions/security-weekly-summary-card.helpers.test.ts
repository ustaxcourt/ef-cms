import {
  DEFAULT_MAX_ROWS,
  FOOTNOTE,
  type RuleGroup,
  type SummaryCard,
  buildSummaryCard,
  groupByRule,
  payloadBytes,
  ruleLink,
  whereFound,
} from './security-weekly-summary-card.helpers';
import { type NewFinding } from './code-scanning-alerts.helpers';
import { type ScanHealth } from './scheduled-scan-health.helpers';

const BASE = 'https://github.com/example/repo/security/code-scanning';
const FILTER = `${BASE}?query=is%3Aopen+branch%3Astaging+rule%3A`;
const ALL_OK: ScanHealth[] = [
  { name: 'Container scans', status: 'ok' },
  { name: 'DAST scan', status: 'ok' },
];

const finding = (overrides: Partial<NewFinding> = {}): NewFinding => ({
  category: 'trivy-baseline-base',
  createdAt: '2026-11-12T15:00:00Z',
  number: 1,
  ruleId: 'CVE-0000-0001',
  scanner: 'trivy',
  severity: 'High',
  url: `${BASE}/${overrides.number ?? 1}`,
  ...overrides,
});

const distinctRules = (count: number, overrides: Partial<NewFinding> = {}) =>
  Array.from({ length: count }, (_, i) =>
    finding({ number: i, ruleId: `CVE-0000-${1000 + i}`, ...overrides }),
  );

const group = (overrides: Partial<RuleGroup> = {}): RuleGroup => ({
  alertCount: 1,
  categories: ['trivy-baseline-base'],
  firstUrl: `${BASE}/7`,
  ruleId: 'CVE-0000-0001',
  scanner: 'trivy',
  severity: 'High',
  ...overrides,
});

const build = (
  options: Partial<Parameters<typeof buildSummaryCard>[0]> = {},
): SummaryCard =>
  buildSummaryCard({
    dashboardUrl: BASE,
    findings: [],
    health: ALL_OK,
    window: {
      since: '2026-11-09T12:00:00.000Z',
      until: '2026-11-16T12:00:00.000Z',
    },
    ...options,
  });

const content = (card: SummaryCard) => card.attachments[0].content;
const body = (card: SummaryCard) =>
  content(card).body as Record<string, unknown>[];
const texts = (card: SummaryCard) =>
  body(card)
    .filter(element => element.type === 'TextBlock')
    .map(element => element.text as string);
const tableRows = (card: SummaryCard): string[][] => {
  const table = body(card).find(element => element.type === 'Table') as
    { rows: { cells: { items: { text: string }[] }[] }[] } | undefined;
  return (table?.rows ?? []).map(row =>
    row.cells.map(cell => cell.items[0].text),
  );
};

describe('groupByRule', () => {
  it('merges alerts that share a scanner and rule, keeping the highest severity', () => {
    expect(
      groupByRule([
        finding({ category: 'trivy-baseline-base', number: 1 }),
        finding({ category: 'trivy-baseline-batch', number: 2 }),
        finding({ category: 'trivy-baseline-base', number: 3 }),
        finding({ number: 4, severity: 'Critical' }),
      ]),
    ).toEqual([
      {
        alertCount: 4,
        categories: ['trivy-baseline-base', 'trivy-baseline-batch'],
        firstUrl: `${BASE}/1`,
        ruleId: 'CVE-0000-0001',
        scanner: 'trivy',
        severity: 'Critical',
      },
    ]);
  });

  it('keeps the same rule ID from different scanners apart', () => {
    expect(
      groupByRule([
        finding(),
        finding({ category: 'semgrep', scanner: 'semgrep' }),
      ]),
    ).toHaveLength(2);
  });

  it('sorts Critical first, then most alerts, then rule ID', () => {
    const groups = groupByRule([
      finding({ ruleId: 'B' }),
      finding({ ruleId: 'A' }),
      finding({ ruleId: 'C' }),
      finding({ ruleId: 'C' }),
      finding({ ruleId: 'Z', severity: 'Critical' }),
    ]);

    expect(groups.map(g => g.ruleId)).toEqual(['Z', 'C', 'A', 'B']);
  });
});

describe('whereFound', () => {
  it.each<[Partial<RuleGroup>, string]>([
    [
      { categories: ['trivy-baseline-batch', 'trivy-baseline-base'] },
      'Trivy: base, batch',
    ],
    [{ categories: ['trivy', 'trivy-config'] }, 'Trivy: config, repo'],
    [{ categories: ['trivy-new-image'] }, 'Trivy: trivy-new-image'],
    [{ categories: ['gitleaks-baseline'], scanner: 'gitleaks' }, 'Gitleaks'],
  ])('%j → %s', (overrides, expected) => {
    expect(whereFound(group(overrides))).toBe(expected);
  });
});

describe('ruleLink', () => {
  it.each<[string, Partial<RuleGroup>, string]>([
    ['links a single alert directly', {}, `${BASE}/7`],
    [
      'filters the Security tab by rule for several alerts',
      { alertCount: 14, ruleId: 'CVE-2026-0001' },
      `${FILTER}CVE-2026-0001`,
    ],
    [
      'encodes characters that would break the link',
      { alertCount: 2, ruleId: 'a b(c)&d' },
      `${FILTER}a%20b%28c%29%26d`,
    ],
  ])('%s', (_, overrides, expected) => {
    expect(ruleLink(group(overrides))).toBe(expected);
  });
});

describe('buildSummaryCard', () => {
  it('builds a Teams Workflows message with the date, window start and footnote', () => {
    const card = build();

    expect(card).toMatchObject({
      attachments: [
        {
          content: { type: 'AdaptiveCard', version: '1.5' },
          contentType: 'application/vnd.microsoft.card.adaptive',
        },
      ],
      type: 'message',
    });
    expect(texts(card)).toEqual([
      'Weekly security summary: Nov 16, 2026',
      '**New findings since 11/09/26 7:00 AM ET: 0**',
      'No new findings this week.',
      FOOTNOTE,
    ]);
    expect(tableRows(card)).toEqual([]);
  });

  it('counts alerts and rules, but shows no table when nothing is High or Critical', () => {
    const card = build({
      findings: [
        finding({ severity: 'Medium' }),
        finding({ severity: 'Medium' }),
        finding({ ruleId: 'other', severity: 'Low' }),
      ],
    });

    expect(texts(card)).toEqual(
      expect.arrayContaining([
        '**New findings since 11/09/26 7:00 AM ET: 3 alerts (2 rules)**',
        'Alerts by severity: Critical 0 · High 0 · Medium 2 · Low 1',
        'No new High or Critical findings.',
      ]),
    );
    expect(tableRows(card)).toEqual([]);
  });

  it('shows one row per rule with its alert count and where it was found', () => {
    const card = build({
      findings: [
        finding({ category: 'trivy-baseline-base', number: 11 }),
        finding({ category: 'trivy-baseline-batch', number: 12 }),
        finding({
          category: 'gitleaks-baseline',
          number: 2,
          ruleId: 'fake*key',
          scanner: 'gitleaks',
          severity: 'Critical',
        }),
        finding({ number: 9, ruleId: 'medium-rule', severity: 'Medium' }),
      ],
    });

    expect(texts(card)[1]).toBe(
      '**New findings since 11/09/26 7:00 AM ET: 4 alerts (3 rules)**',
    );
    expect(tableRows(card)).toEqual([
      ['Severity', 'Rule', 'Alerts', 'Where'],
      ['Critical', `[fake\\*key](${BASE}/2)`, '1', 'Gitleaks'],
      [
        'High',
        `[CVE-0000-0001](${FILTER}CVE-0000-0001)`,
        '2',
        'Trivy: base, batch',
      ],
    ]);
  });

  it.each([
    [
      DEFAULT_MAX_ROWS + 5,
      undefined,
      '5 more High or Critical rules (5 alerts)',
    ],
    [2, 1, '1 more High or Critical rule (1 alert)'],
  ])(
    'caps %d rules at %s rows and says how many more',
    (count, maxRows, message) => {
      const card = build({ findings: distinctRules(count), maxRows });

      expect(tableRows(card)).toHaveLength((maxRows ?? DEFAULT_MAX_ROWS) + 1);
      expect(texts(card)).toContain(`…and ${message} on the dashboard.`);
    },
  );

  it('drops rows until the payload fits the size limit', () => {
    const card = build({
      findings: distinctRules(500, { category: `x${'y'.repeat(300)}` }),
      maxBytes: 8_000,
    });

    const shown = tableRows(card).length - 1;
    expect(payloadBytes(card)).toBeLessThanOrEqual(8_000);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(DEFAULT_MAX_ROWS);
  });

  it('leaves the table out when not even one row fits, but still says how many', () => {
    const card = build({ findings: distinctRules(3), maxBytes: 100 });

    expect(tableRows(card)).toEqual([]);
    expect(texts(card)).toContain(
      '…and 3 more High or Critical rules (3 alerts) on the dashboard.',
    );
  });

  it('keeps 806 alerts across 145 rules under the default size limit', () => {
    const findings = Array.from({ length: 806 }, (_, i) =>
      finding({ number: i, ruleId: `CVE-2026-${10000 + (i % 145)}` }),
    );

    const card = build({ findings });

    expect(payloadBytes(card)).toBeLessThanOrEqual(24_000);
    expect(texts(card)[1]).toContain('806 alerts (145 rules)');
  });

  it('warns about each scan that did not run cleanly', () => {
    const card = build({
      health: [
        { name: 'A', status: 'failed', url: 'https://run/1' },
        { name: 'B', status: 'missing' },
        { name: 'C', status: 'in_progress', url: 'https://run/3' },
        { name: 'D', status: 'unknown' },
        { name: 'E', status: 'ok' },
      ],
    });

    const suffix = '. Counts below may be incomplete.';
    expect(texts(card).filter(text => text.startsWith('⚠️'))).toEqual([
      `⚠️ A failed ([view run](https://run/1))${suffix}`,
      `⚠️ B did not run this week${suffix}`,
      `⚠️ C was still running ([view run](https://run/3))${suffix}`,
      `⚠️ D could not be checked${suffix}`,
    ]);
  });

  it('has a dashboard button, plus a run button when there is a run URL', () => {
    const openDashboard = {
      title: 'Open dashboard',
      type: 'Action.OpenUrl',
      url: BASE,
    };

    expect(content(build()).actions).toEqual([openDashboard]);
    expect(content(build({ runUrl: 'https://run/9' })).actions).toEqual([
      openDashboard,
      { title: 'View run', type: 'Action.OpenUrl', url: 'https://run/9' },
    ]);
  });

  it('never carries file paths, messages or snippets', () => {
    const json = JSON.stringify(
      build({ findings: [finding(), finding({ severity: 'Critical' })] }),
    );

    for (const key of ['uri', 'path', 'message', 'snippet', 'location']) {
      expect(json).not.toContain(`"${key}":`);
    }
  });
});
