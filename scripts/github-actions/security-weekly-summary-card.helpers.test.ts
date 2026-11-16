import {
  DEFAULT_MAX_ROWS,
  FOOTNOTE,
  type SummaryCard,
  buildSummaryCard,
  payloadBytes,
} from './security-weekly-summary-card.helpers';
import {
  type NewFinding,
  type ScanHealth,
} from './security-weekly-summary.helpers';

const DASHBOARD = 'https://github.com/example/repo/security/code-scanning';
const ALL_OK: ScanHealth[] = [
  { name: 'Container scans', status: 'ok' },
  { name: 'DAST scan', status: 'ok' },
];

const finding = (overrides: Partial<NewFinding> = {}): NewFinding => ({
  category: 'semgrep',
  createdAt: '2026-11-12T15:00:00Z',
  number: 1,
  ruleId: 'fake.rule.id',
  scanner: 'semgrep',
  severity: 'High',
  url: `${DASHBOARD}/1`,
  ...overrides,
});

const many = (count: number, overrides: Partial<NewFinding> = {}) =>
  Array.from({ length: count }, (_, i) => finding({ number: i, ...overrides }));

const build = (
  options: Partial<Parameters<typeof buildSummaryCard>[0]> = {},
): SummaryCard =>
  buildSummaryCard({
    dashboardUrl: DASHBOARD,
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

  it('gives counts but no table when nothing is High or Critical', () => {
    const card = build({
      findings: [
        finding({ severity: 'Medium' }),
        finding({ severity: 'Medium' }),
        finding({ severity: 'Low' }),
      ],
    });

    expect(texts(card)).toEqual(
      expect.arrayContaining([
        '**New findings since 11/09/26 7:00 AM ET: 3**',
        'Critical 0 · High 0 · Medium 2 · Low 1',
        'No new High or Critical findings.',
      ]),
    );
    expect(tableRows(card)).toEqual([]);
  });

  it('lists High and Critical, Critical first then oldest first, escaping rule IDs', () => {
    const card = build({
      findings: [
        finding({ createdAt: '2026-11-13T15:00:00Z', number: 3 }),
        finding({ number: 9, severity: 'Medium' }),
        finding({
          createdAt: '2026-11-14T15:00:00Z',
          number: 2,
          ruleId: 'fake*key[1]',
          scanner: 'gitleaks',
          severity: 'Critical',
          url: `${DASHBOARD}/2`,
        }),
        finding({ createdAt: '2026-11-10T15:00:00Z', number: 4 }),
      ],
    });

    expect(tableRows(card)).toEqual([
      ['Severity', 'Scanner', 'Rule', 'First seen', 'Alert'],
      [
        'Critical',
        'Gitleaks',
        'fake\\*key\\[1\\]',
        '11/14',
        `[#2](${DASHBOARD}/2)`,
      ],
      expect.arrayContaining(['High', '11/10']),
      expect.arrayContaining(['High', '11/13']),
    ]);
  });

  it.each([
    [DEFAULT_MAX_ROWS + 5, undefined, '5 more High or Critical findings'],
    [2, 1, '1 more High or Critical finding on'],
  ])('caps %d rows at %s and says how many more', (count, maxRows, message) => {
    const card = build({ findings: many(count), maxRows });

    expect(tableRows(card)).toHaveLength((maxRows ?? DEFAULT_MAX_ROWS) + 1);
    expect(texts(card).join('\n')).toContain(`…and ${message}`);
  });

  it('drops rows until the payload fits the size limit', () => {
    const card = build({
      findings: many(500, { ruleId: `fake.rule.${'x'.repeat(200)}` }),
      maxBytes: 8_000,
    });

    const shown = tableRows(card).length - 1;
    expect(payloadBytes(card)).toBeLessThanOrEqual(8_000);
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(DEFAULT_MAX_ROWS);
    expect(texts(card)).toContain(
      `…and ${500 - shown} more High or Critical findings on the dashboard.`,
    );
  });

  it('keeps 500 findings under the default size limit', () => {
    expect(
      payloadBytes(build({ findings: many(500, { severity: 'Critical' }) })),
    ).toBeLessThanOrEqual(24_000);
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
      url: DASHBOARD,
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
