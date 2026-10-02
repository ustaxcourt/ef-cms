import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import path from 'path';

const SCRIPT = path.resolve(
  __dirname,
  '../../.github/actions/dawson-sarif-summary/summarize-sarif.sh',
);

type SarifResult = {
  level?: string;
  locations?: unknown[];
  message?: { text: string };
  ruleId?: string;
};

type SarifRule = {
  defaultConfiguration?: { level: string };
  id: string;
  properties?: Record<string, string>;
  shortDescription?: { text: string };
};

const sarif = (results: SarifResult[], rules: SarifRule[] = []): string =>
  JSON.stringify({
    runs: [{ results, tool: { driver: { name: 'test', rules } } }],
  });

const location = (
  uri: string,
  region?: Record<string, unknown>,
): { physicalLocation: Record<string, unknown> } => ({
  physicalLocation: { artifactLocation: { uri }, ...(region && { region }) },
});

describe('summarize-sarif.sh', () => {
  let workDir: string;

  beforeEach(() => {
    workDir = mkdtempSync(path.join(tmpdir(), 'summarize-sarif-'));
  });

  afterEach(() => {
    rmSync(workDir, { force: true, recursive: true });
  });

  const run = (
    contents: string | null,
    env: Record<string, string> = {},
  ): { output: string; status: number | null; summary: string } => {
    const sarifFile = path.join(workDir, 'report.sarif');
    const summaryFile = path.join(workDir, 'summary.md');
    if (contents !== null) {
      writeFileSync(sarifFile, contents);
    }
    writeFileSync(summaryFile, '');
    const result = spawnSync('bash', [SCRIPT], {
      encoding: 'utf-8',
      env: {
        ...process.env,
        GITHUB_STEP_SUMMARY: summaryFile,
        SARIF_FILE: sarifFile,
        SUMMARY_TITLE: 'Test scan',
        ...env,
      },
      maxBuffer: 64 * 1024 * 1024,
    });
    return {
      output: result.stdout,
      status: result.status,
      summary: readFileSync(summaryFile, 'utf-8'),
    };
  };

  it('reports a missing report without failing', () => {
    const { output, status } = run(null);

    expect(status).toBe(0);
    expect(output).toContain('Test scan: no SARIF report at');
  });

  it('reports no findings for an empty report', () => {
    const { output, status } = run(sarif([]));

    expect(status).toBe(0);
    expect(output).toContain('### Test scan');
    expect(output).toContain('No findings.');
  });

  it('writes the same text to the job summary as to the log', () => {
    const { output, summary } = run(sarif([]));

    expect(summary).toBe(output);
  });

  describe('Semgrep-style reports', () => {
    const rules: SarifRule[] = [
      {
        defaultConfiguration: { level: 'error' },
        id: 'rules.command-injection',
        shortDescription: { text: 'Semgrep Finding: rules.command-injection' },
      },
    ];
    const results: SarifResult[] = [
      {
        locations: [
          location('src/handler.ts', {
            endColumn: 21,
            endLine: 4,
            snippet: { text: '  exec(`ls ${name}`);\n  other();' },
            startColumn: 3,
            startLine: 4,
          }),
        ],
        message: { text: 'Potential command injection.\n' },
        ruleId: 'rules.command-injection',
      },
    ];

    it('takes the level from the rule when the result has none', () => {
      const { output } = run(sarif(results, rules));

      expect(output).toContain('(1 error)');
      expect(output).toContain('- **error** `rules.command-injection`');
    });

    it('lets a level on the result override the rule', () => {
      const { output } = run(sarif([{ ...results[0], level: 'note' }], rules));

      expect(output).toContain('- **note** `rules.command-injection`');
    });

    it('lists the file and line, the message, and the first line of the snippet', () => {
      const { output } = run(sarif(results, rules));

      expect(output).toContain('in `src/handler.ts:4`');
      expect(output).toContain('  - Potential command injection.');
      expect(output).toContain('  - `` exec(`ls ${name}`); ``');
      expect(output).not.toContain('other();');
    });

    it('drops the placeholder Semgrep title', () => {
      const { output } = run(sarif(results, rules));

      expect(output).not.toContain('Semgrep Finding:');
    });

    it('wraps snippets without backticks in a single code span', () => {
      const withoutBackticks: SarifResult[] = [
        {
          ...results[0],
          locations: [
            location('src/a.ts', {
              endLine: 9,
              snippet: { text: 'JSON.parse(body);' },
              startLine: 9,
            }),
          ],
        },
      ];

      const { output } = run(sarif(withoutBackticks, rules));

      expect(output).toContain('  - `JSON.parse(body);`');
    });
  });

  describe('Trivy-style reports', () => {
    const rules: SarifRule[] = [
      {
        id: 'CVE-2020-8203',
        properties: { 'security-severity': '7.4' },
        shortDescription: { text: 'lodash: prototype pollution' },
      },
    ];
    const trivyResult = (
      overrides: Partial<SarifResult> = {},
    ): SarifResult => ({
      level: 'error',
      locations: [
        location('package-lock.json', {
          endColumn: 1,
          endLine: 1,
          startColumn: 1,
          startLine: 1,
        }),
      ],
      message: {
        text: 'Package: lodash\nInstalled Version: 4.17.15\nVulnerability CVE-2020-8203\nSeverity: HIGH\nFixed Version: 4.17.19\nLink: [CVE-2020-8203](https://avd.aquasec.com/nvd/cve-2020-8203)',
      },
      ruleId: 'CVE-2020-8203',
      ...overrides,
    });

    it('shows the package, installed and fixed versions on one line', () => {
      const { output } = run(sarif([trivyResult()], rules));

      expect(output).toContain('  - lodash: prototype pollution');
      expect(output).toContain(
        '  - Package: lodash · Installed Version: 4.17.15 · Severity: HIGH · Fixed Version: 4.17.19 · Link: [CVE-2020-8203](https://avd.aquasec.com/nvd/cve-2020-8203)',
      );
    });

    it('omits the redundant Vulnerability line', () => {
      const { output } = run(sarif([trivyResult()], rules));

      expect(output).not.toContain('Vulnerability CVE-2020-8203');
    });

    it('omits the line number for the 1:1 placeholder region', () => {
      const { output } = run(sarif([trivyResult()], rules));

      expect(output).toContain('in `package-lock.json`');
      expect(output).not.toContain('package-lock.json:1');
    });

    it('keeps a real line number at the start of a file', () => {
      const atLineOne = trivyResult({
        locations: [
          location('src/a.ts', {
            endColumn: 30,
            endLine: 1,
            startColumn: 1,
            startLine: 1,
          }),
        ],
      });

      const { output } = run(sarif([atLineOne], rules));

      expect(output).toContain('in `src/a.ts:1`');
    });

    it('says when no fixed version is published', () => {
      const unfixed = trivyResult({
        message: {
          text: 'Package: zlib1g\nInstalled Version: 1.2.13\nFixed Version: ',
        },
      });

      const { output } = run(sarif([unfixed], rules));

      expect(output).toContain('Fixed Version: none published');
    });
  });

  describe('results with missing detail', () => {
    it('falls back to warning, an unknown location and (none) for the rule', () => {
      const { output, status } = run(
        sarif([{ message: { text: 'Something' } }]),
      );

      expect(status).toBe(0);
      expect(output).toContain(
        '- **warning** `(none)` in `(unknown location)`',
      );
    });

    it('does not repeat a message identical to the title', () => {
      const rules: SarifRule[] = [
        { id: 'R1', shortDescription: { text: 'Same text' } },
      ];

      const { output } = run(
        sarif([{ message: { text: 'Same text' }, ruleId: 'R1' }], rules),
      );

      expect(output.match(/Same text/g)).toHaveLength(1);
    });
  });

  describe('ordering', () => {
    it('lists errors before warnings before notes, then higher security severity first', () => {
      const rules: SarifRule[] = [
        { id: 'LOW', properties: { 'security-severity': '2.0' } },
        { id: 'HIGH', properties: { 'security-severity': '9.1' } },
      ];
      const { output } = run(
        sarif(
          [
            { level: 'note', ruleId: 'NOTE' },
            { level: 'warning', ruleId: 'WARN' },
            { level: 'error', ruleId: 'LOW' },
            { level: 'error', ruleId: 'HIGH' },
          ],
          rules,
        ),
      );

      const order = [...output.matchAll(/- \*\*\w+\*\* `([^`]+)`/g)].map(
        match => match[1],
      );
      expect(order).toEqual(['HIGH', 'LOW', 'WARN', 'NOTE']);
      expect(output).toContain('(2 error, 1 warning, 1 note)');
    });
  });

  describe('truncation', () => {
    const manyResults = (count: number): SarifResult[] =>
      Array.from({ length: count }, (_, index) => ({
        level: 'error',
        locations: [location(`src/file-${index}.ts`, { startLine: 10 })],
        message: {
          text: `Package: package-${index}\nInstalled Version: 1.0.${index}\nSeverity: HIGH\nFixed Version: 2.0.0\nLink: [CVE](https://example.com/advisory/${index})`,
        },
        ruleId: `CVE-2026-${index}`,
      }));

    const listed = (output: string): number =>
      (output.match(/^- \*\*/gm) ?? []).length;

    it('lists every finding when there are fewer than the cap', () => {
      const { output, status } = run(sarif(manyResults(3)));

      expect(status).toBe(0);
      expect(listed(output)).toBe(3);
      expect(output).not.toContain('Showing the');
    });

    it('caps the list at 100 findings and adds a by-rule table', () => {
      const { output, status } = run(sarif(manyResults(150)));

      expect(status).toBe(0);
      expect(listed(output)).toBe(100);
      expect(output).toContain(
        'Showing the 100 most severe of 150 findings. Rules by count:',
      );
      expect(output).toContain('| Count | Rule | Description |');
    });

    // A report this long overflows the pipe buffer. Truncating with head under pipefail
    // killed the script with SIGPIPE before it printed the notice and the rule table.
    it('finishes with a very long report', () => {
      const { output, status } = run(sarif(manyResults(2000)));

      expect(status).toBe(0);
      expect(listed(output)).toBe(100);
      expect(output).toContain('Showing the 100 most severe of 2000 findings');
      expect(output).toContain('| 1 | CVE-2026-');
    });

    it('honours max_findings', () => {
      const { output } = run(sarif(manyResults(10)), { MAX_FINDINGS: '4' });

      expect(listed(output)).toBe(4);
      expect(output).toContain('Showing the 4 most severe of 10 findings');
    });

    it('honours max_rules in the by-rule table', () => {
      const { output } = run(sarif(manyResults(10)), {
        MAX_FINDINGS: '2',
        MAX_RULES: '3',
      });

      expect((output.match(/^\| 1 \| CVE-/gm) ?? []).length).toBe(3);
    });

    it('escapes pipes in the by-rule table', () => {
      const rules: SarifRule[] = [
        { id: 'R1', shortDescription: { text: 'a | b' } },
      ];
      const results: SarifResult[] = [
        { ruleId: 'R1' },
        { ruleId: 'R1' },
        { ruleId: 'R1' },
      ];

      const { output } = run(sarif(results, rules), { MAX_FINDINGS: '1' });

      expect(output).toContain('| 3 | R1 | a \\| b |');
    });
  });
});
