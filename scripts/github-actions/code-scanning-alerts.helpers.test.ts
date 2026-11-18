jest.mock('../helpers/runCommand', () => ({ runCommand: jest.fn() }));

import {
  ALERTS_PER_PAGE,
  CHECKOV_HARD_FAIL_CHECKS,
  type CodeScanningAlert,
  TRIAGE_SCOPE_PATTERN,
  getTriageWindow,
  isInTriageScope,
  listOpenStagingAlertsCreatedIn,
  listNewFindings,
  scannerForCategory,
  toFinding,
  toScannerSeverity,
} from './code-scanning-alerts.helpers';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { runCommand } from '../helpers/runCommand';

const REPO_ROOT = resolve(__dirname, '../..');
const readRepoFile = (path: string) =>
  readFileSync(resolve(REPO_ROOT, path), 'utf-8');

const CODEQL = '/language:javascript-typescript';
const WINDOW = {
  since: '2026-11-09T12:00:00.000Z',
  until: '2026-11-16T12:00:00.000Z',
};

type AlertOverrides = Partial<Omit<CodeScanningAlert, 'rule'>> &
  Partial<CodeScanningAlert['rule']>;

const alert = ({
  category = 'semgrep',
  created_at = '2026-11-12T15:00:00Z',
  id = 'fake.rule.id',
  number = 1,
  security_severity_level = null,
  severity = 'warning',
  tags = null,
}: AlertOverrides = {}): CodeScanningAlert => ({
  category,
  created_at,
  html_url: `https://github.com/example/repo/security/code-scanning/${number}`,
  number,
  rule: { id, security_severity_level, severity, tags },
});

const toLines = (alerts: CodeScanningAlert[]) =>
  alerts.map(a => JSON.stringify(a)).join('\n');

const runnerReturning = (...outputs: string[]) => {
  const runner = jest.fn();
  outputs.forEach(output => runner.mockResolvedValueOnce(output));
  return runner;
};

describe('getTriageWindow', () => {
  it.each([
    ['winter', '2026-11-16T12:55:00Z', '2026-11-09T12:00', '2026-11-16T12:00'],
    ['summer', '2026-07-13T11:55:00Z', '2026-07-06T11:00', '2026-07-13T11:00'],
    [
      'into EDT',
      '2026-03-09T11:55:00Z',
      '2026-03-02T12:00',
      '2026-03-09T11:00',
    ],
    [
      'into EST',
      '2026-11-02T12:55:00Z',
      '2026-10-26T11:00',
      '2026-11-02T12:00',
    ],
    [
      'mid-week',
      '2026-11-19T18:00:00Z',
      '2026-11-09T12:00',
      '2026-11-16T12:00',
    ],
    [
      'Monday 6am ET',
      '2026-11-16T11:00:00Z',
      '2026-11-02T12:00',
      '2026-11-09T12:00',
    ],
  ])('runs Monday 07:00 ET to Monday 07:00 ET (%s)', (_, now, since, until) => {
    expect(getTriageWindow({ now })).toEqual({
      since: `${since}:00.000Z`,
      until: `${until}:00.000Z`,
    });
  });

  it('starts a SINCE override at 07:00 Eastern on that date and ends at now', () => {
    expect(
      getTriageWindow({ now: '2026-11-16T15:30:00Z', since: '2026-11-02' }),
    ).toEqual({
      since: '2026-11-02T12:00:00.000Z',
      until: '2026-11-16T15:30:00.000Z',
    });
  });

  it.each([
    ['last week', 'SINCE must be an ISO date'],
    ['2026-11-02T10:00', 'SINCE must be an ISO date'],
    ['2026-12-01', 'SINCE must be in the past'],
    ['2026-11-16', 'SINCE must be in the past'],
  ])('rejects SINCE=%s', (since, message) => {
    expect(() =>
      getTriageWindow({ now: '2026-11-16T11:30:00Z', since }),
    ).toThrow(message);
  });
});

describe('category and Checkov lists', () => {
  it.each([
    ['trivy-baseline-base', true],
    ['trivy-baseline-batch', true],
    ['trivy', true],
    ['trivy-config', true],
    ['semgrep', true],
    ['checkov', true],
    [CODEQL, true],
    ['gitleaks-baseline', true],
    ['trivy-image-base', false],
    ['trivy-baseline-local', false],
    ['zap-web', false],
  ])('treats %s as triaged: %s', (category, expected) => {
    expect(TRIAGE_SCOPE_PATTERN.test(category)).toBe(expected);
  });

  it('matches both copies of the regex in the weekly-triage runbook', () => {
    const runbook = readRepoFile('docs/security/remediation/weekly-triage.md');
    const copies = [...runbook.matchAll(/\^\(trivy-baseline[^"']*\)\$/g)];
    expect(copies).toHaveLength(2);
    copies.forEach(([copy]) =>
      expect(copy).toBe(TRIAGE_SCOPE_PATTERN.source.replace(/\\\//g, '/')),
    );
  });

  it('matches --hard-fail-on in security-sast.yml', () => {
    const workflow = readRepoFile('.github/workflows/security-sast.yml');
    const hardFailOn = workflow.match(/--hard-fail-on (\S+)/)?.[1];
    expect(hardFailOn?.split(',').sort()).toEqual(
      [...CHECKOV_HARD_FAIL_CHECKS].sort(),
    );
  });
});

describe('scannerForCategory', () => {
  it.each([
    [CODEQL, 'codeql'],
    ['trivy-config', 'trivy'],
    ['gitleaks-baseline', 'gitleaks'],
    ['semgrep', 'semgrep'],
    ['checkov', 'checkov'],
    ['zap-web', 'unknown'],
    [null, 'unknown'],
  ])('maps %s to %s', (category, scanner) => {
    expect(scannerForCategory(category)).toBe(scanner);
  });
});

describe('isInTriageScope', () => {
  it.each<[string, AlertOverrides, boolean]>([
    ['a triaged category', { category: 'checkov' }, true],
    ['a duplicate category', { category: 'trivy-image-base' }, false],
    ['no category', { category: null }, false],
    ['CodeQL code quality', { category: CODEQL }, false],
    [
      'CodeQL security',
      { category: CODEQL, security_severity_level: 'high' },
      true,
    ],
  ])('%s: %s', (_, overrides, expected) => {
    expect(isInTriageScope(alert(overrides))).toBe(expected);
  });
});

describe('toScannerSeverity', () => {
  it.each<[string, AlertOverrides, string]>([
    ['gitleaks', { category: 'gitleaks-baseline' }, 'Critical'],
    ['Checkov hard-fail', { category: 'checkov', id: 'CKV_AWS_57' }, 'High'],
    ['Checkov other', { category: 'checkov', id: 'CKV_AWS_999' }, 'Medium'],
    ['Checkov no ID', { category: 'checkov', id: null }, 'Medium'],
    ['Semgrep error', { severity: 'error' }, 'High'],
    ['Semgrep warning', { severity: 'warning' }, 'Medium'],
    ['Semgrep note', { severity: 'note' }, 'Low'],
    ['Semgrep none', { severity: null }, 'Low'],
    [
      'Trivy tag wins',
      {
        category: 'trivy',
        security_severity_level: 'medium',
        tags: ['security', 'CRITICAL'],
      },
      'Critical',
    ],
    [
      'Trivy level',
      { category: 'trivy-config', security_severity_level: 'low' },
      'Low',
    ],
    ['Trivy UNKNOWN', { category: 'trivy', tags: ['UNKNOWN'] }, 'High'],
    ['Trivy nothing', { category: 'trivy' }, 'High'],
    [
      'CodeQL',
      { category: CODEQL, security_severity_level: 'critical' },
      'Critical',
    ],
  ])('%s', (_, overrides, expected) => {
    expect(toScannerSeverity(alert(overrides))).toBe(expected);
  });

  it.each<[string, AlertOverrides, string | RegExp]>([
    [
      'CodeQL with no security severity',
      { category: CODEQL, number: 4242 },
      /^A CodeQL alert has no security severity[^0-9]*$/,
    ],
    ['an unknown scanner', { category: 'zap-web' }, 'category "zap-web"'],
    ['no category', { category: null }, 'category "(none)"'],
  ])('throws for %s', (_, overrides, message) => {
    expect(() => toScannerSeverity(alert(overrides))).toThrow(message);
  });
});

describe('toFinding', () => {
  it('keeps only the fields the summary needs', () => {
    expect(
      toFinding(alert({ category: 'gitleaks-baseline', id: null, number: 42 })),
    ).toEqual({
      category: 'gitleaks-baseline',
      createdAt: '2026-11-12T15:00:00Z',
      number: 42,
      ruleId: '(none)',
      scanner: 'gitleaks',
      severity: 'Critical',
      url: 'https://github.com/example/repo/security/code-scanning/42',
    });
  });
});

describe('listOpenStagingAlertsCreatedIn', () => {
  const fullPage = (createdAt: string) =>
    Array.from({ length: ALERTS_PER_PAGE }, (_, i) =>
      alert({ created_at: createdAt, number: i }),
    );
  const list = (commandRunner: jest.Mock, maxPages?: number) =>
    listOpenStagingAlertsCreatedIn({
      commandRunner,
      maxPages,
      repo: 'example/repo',
      window: WINDOW,
    });

  it('asks gh for newest-first open staging alerts and keeps those in the window', async () => {
    const runner = runnerReturning(
      `${toLines([
        alert({ created_at: '2026-11-16T12:00:00Z', number: 3 }),
        alert({ created_at: '2026-11-12T15:00:00Z', number: 2 }),
        alert({ created_at: '2026-11-09T12:00:00Z', number: 1 }),
        alert({ created_at: '2026-11-01T12:00:00Z', number: 0 }),
      ])}\n\n`,
    );

    const alerts = await list(runner);

    expect(alerts.map(a => a.number)).toEqual([2, 1]);
    expect(runner).toHaveBeenCalledTimes(1);
    expect(runner).toHaveBeenCalledWith(
      'gh',
      [
        'api',
        'repos/example/repo/code-scanning/alerts?state=open&ref=refs/heads/staging&sort=created&direction=desc&per_page=100&page=1',
        '--jq',
        expect.stringContaining('@json'),
      ],
      { GH_PAGER: 'cat', PAGER: 'cat' },
    );
  });

  it('keeps paging while full pages are inside the window', async () => {
    const runner = runnerReturning(
      toLines(fullPage('2026-11-14T00:00:00Z')),
      toLines([alert({ created_at: '2026-11-10T00:00:00Z' })]),
    );

    expect(await list(runner)).toHaveLength(ALERTS_PER_PAGE + 1);
    expect(runner.mock.calls[1][1][1]).toContain('&page=2');
  });

  it('stops at a full page that reaches back past since', async () => {
    const page = fullPage('2026-11-10T00:00:00Z');
    page[page.length - 1] = alert({ created_at: '2026-11-01T00:00:00Z' });
    const runner = runnerReturning(toLines(page));

    await list(runner);

    expect(runner).toHaveBeenCalledTimes(1);
  });

  it('throws instead of looping forever', async () => {
    const runner = jest
      .fn()
      .mockResolvedValue(toLines(fullPage('2026-11-14T00:00:00Z')));

    await expect(list(runner, 3)).rejects.toThrow('Stopped after 3 pages');
  });

  it('uses runCommand by default', async () => {
    (runCommand as jest.Mock).mockResolvedValue('');

    await listOpenStagingAlertsCreatedIn({
      repo: 'example/repo',
      window: WINDOW,
    });

    expect(runCommand).toHaveBeenCalledTimes(1);
  });
});

describe('listNewFindings', () => {
  it('returns only triaged alerts, as findings', async () => {
    const runner = runnerReturning(
      toLines([
        alert({ category: 'gitleaks-baseline', number: 3 }),
        alert({ category: 'trivy-image-base', number: 2 }),
        alert({ category: CODEQL, number: 1 }),
      ]),
    );

    const findings = await listNewFindings({
      commandRunner: runner,
      repo: 'example/repo',
      window: WINDOW,
    });

    expect(findings).toEqual([
      expect.objectContaining({ number: 3, severity: 'Critical' }),
    ]);
  });
});
