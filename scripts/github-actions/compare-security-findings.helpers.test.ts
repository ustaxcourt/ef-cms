jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

import { existsSync, readFileSync } from 'fs';
import {
  COMPARISON_TABLE_DIVIDER,
  COMPARISON_TABLE_HEADER,
  compareToolFindings,
  extractFindings,
  type Finding,
  findingKey,
  formatChange,
  formatFinding,
  hasRegressions,
  readMessageField,
  readSarifFindings,
  FINDINGS_HEADINGS,
  renderComparisonTable,
  renderFindings,
  type SarifResult,
  toFinding,
  type ToolComparison,
} from './compare-security-findings.helpers';

const trivyResult = ({
  installedVersion = '5.0.9',
  line = 14499,
  packageName = 'brace-expansion',
  ruleId = 'CVE-2026-102278',
  uri = 'package-lock.json',
}: {
  installedVersion?: string;
  line?: number;
  packageName?: string;
  ruleId?: string;
  uri?: string;
} = {}): SarifResult => ({
  locations: [
    {
      physicalLocation: {
        artifactLocation: { uri },
        region: { startLine: line },
      },
    },
  ],
  message: {
    text: `Package: ${packageName}\nInstalled Version: ${installedVersion}\nVulnerability ${ruleId}\nSeverity: HIGH\nFixed Version: 5.0.11\nLink: [${ruleId}](https://avd.aquasec.com/nvd/${ruleId.toLowerCase()})`,
  },
  ruleId,
});

const finding = (overrides: Partial<Finding> = {}): Finding => ({
  installedVersion: '5.0.9',
  packageName: 'brace-expansion',
  ruleId: 'CVE-2026-102278',
  severity: 'HIGH',
  uri: 'package-lock.json',
  ...overrides,
});

const comparison = (
  overrides: Partial<ToolComparison> = {},
): ToolComparison => ({
  branchCount: 1,
  existingFindings: [],
  fixedCount: 0,
  newFindings: [],
  regression: false,
  stagingCount: 1,
  tool: 'trivy-fs',
  ...overrides,
});

describe('compare-security-findings.helpers', () => {
  describe('readMessageField', () => {
    it('reads the value after the field name', () => {
      expect(
        readMessageField('Package: lodash\nSeverity: HIGH', 'Severity'),
      ).toBe('HIGH');
    });

    it('returns an empty string when the field is absent', () => {
      expect(readMessageField('Potential command injection.', 'Package')).toBe(
        '',
      );
    });
  });

  describe('toFinding', () => {
    it('reads the rule, file, package, version and severity of a Trivy result', () => {
      expect(toFinding(trivyResult())).toEqual(finding());
    });

    it('fills placeholders when the result has no rule, location or message', () => {
      expect(toFinding({})).toEqual({
        installedVersion: '',
        packageName: '',
        ruleId: '(none)',
        severity: '',
        uri: '(unknown location)',
      });
    });
  });

  describe('findingKey', () => {
    it('ignores the installed version, so a bump that leaves the CVE open matches', () => {
      expect(findingKey(finding({ installedVersion: '5.0.10' }))).toBe(
        findingKey(finding()),
      );
    });

    it('distinguishes the same CVE in a different file', () => {
      expect(
        findingKey(finding({ uri: 'web-client/package-lock.json' })),
      ).not.toBe(findingKey(finding()));
    });
  });

  describe('extractFindings', () => {
    it('lists results across every run', () => {
      const sarif = JSON.stringify({
        runs: [
          { results: [trivyResult(), trivyResult({ ruleId: 'CVE-1' })] },
          { results: [trivyResult({ ruleId: 'CVE-2' })] },
        ],
      });
      expect(extractFindings(sarif).map(({ ruleId }) => ruleId)).toEqual([
        'CVE-2026-102278',
        'CVE-1',
        'CVE-2',
      ]);
    });

    it('returns no findings when a run has no results', () => {
      expect(extractFindings(JSON.stringify({ runs: [{}] }))).toEqual([]);
    });

    it('returns no findings when the document has no runs', () => {
      expect(extractFindings(JSON.stringify({}))).toEqual([]);
    });

    it('throws when the report is not valid JSON', () => {
      expect(() => extractFindings('not json')).toThrow(
        'SARIF report is not valid JSON',
      );
    });
  });

  describe('readSarifFindings', () => {
    it('returns null when the report is missing', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      expect(readSarifFindings('missing.sarif')).toBeNull();
    });

    it('reads the findings when the report exists', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ runs: [{ results: [trivyResult()] }] }),
      );
      expect(readSarifFindings('present.sarif')).toEqual([finding()]);
    });
  });

  describe('compareToolFindings', () => {
    it('does not fail when the branch produced no report', () => {
      expect(
        compareToolFindings({
          branchFindings: null,
          stagingFindings: [finding()],
          tool: 'trivy-fs',
        }),
      ).toEqual({
        branchCount: null,
        existingFindings: [],
        fixedCount: 0,
        newFindings: [],
        note: 'no report produced for this branch',
        regression: false,
        stagingCount: 1,
        tool: 'trivy-fs',
      });
    });

    it('does not fail when staging has no baseline', () => {
      expect(
        compareToolFindings({
          branchFindings: [finding()],
          stagingFindings: null,
          tool: 'trivy-fs',
        }),
      ).toEqual({
        branchCount: 1,
        existingFindings: [],
        fixedCount: 0,
        newFindings: [],
        note: 'no staging baseline to compare against',
        regression: false,
        stagingCount: null,
        tool: 'trivy-fs',
      });
    });

    it('passes when a newly published CVE is on both staging and the branch, and reports it as already on staging', () => {
      const result = compareToolFindings({
        branchFindings: [finding()],
        stagingFindings: [finding()],
        tool: 'trivy-fs',
      });
      expect(result.regression).toBe(false);
      expect(result.newFindings).toEqual([]);
      expect(result.existingFindings).toEqual([finding()]);
    });

    it('fails when the branch swaps a fixed finding for a different one, even though the count is unchanged', () => {
      const added = finding({ packageName: 'lodash', ruleId: 'CVE-2020-8203' });
      const result = compareToolFindings({
        branchFindings: [added],
        stagingFindings: [finding()],
        tool: 'trivy-fs',
      });
      expect(result).toEqual({
        branchCount: 1,
        existingFindings: [],
        fixedCount: 1,
        newFindings: [added],
        regression: true,
        stagingCount: 1,
        tool: 'trivy-fs',
      });
    });

    it('passes when the branch only fixes findings', () => {
      const result = compareToolFindings({
        branchFindings: [],
        stagingFindings: [finding()],
        tool: 'trivy-fs',
      });
      expect(result.regression).toBe(false);
      expect(result.fixedCount).toBe(1);
    });

    it('treats a version bump that leaves the same CVE open as not new', () => {
      expect(
        compareToolFindings({
          branchFindings: [finding({ installedVersion: '5.0.10' })],
          stagingFindings: [finding()],
          tool: 'trivy-fs',
        }).regression,
      ).toBe(false);
    });

    it('counts and reports a finding repeated in one report once', () => {
      const added = finding({ ruleId: 'CVE-NEW' });
      const result = compareToolFindings({
        branchFindings: [added, added],
        stagingFindings: [],
        tool: 'trivy-fs',
      });
      expect(result.branchCount).toBe(1);
      expect(result.newFindings).toEqual([added]);
    });
  });

  describe('hasRegressions', () => {
    it('is true when any tool regressed', () => {
      expect(
        hasRegressions([comparison(), comparison({ regression: true })]),
      ).toBe(true);
    });

    it('is false when no tool regressed', () => {
      expect(hasRegressions([comparison()])).toBe(false);
    });
  });

  describe('formatChange', () => {
    it('reports the note when one is present', () => {
      expect(
        formatChange(
          comparison({ note: 'no report produced for this branch' }),
        ),
      ).toBe('no report produced for this branch');
    });

    it('reports new and fixed findings together', () => {
      expect(
        formatChange(
          comparison({ fixedCount: 1, newFindings: [finding(), finding()] }),
        ),
      ).toBe('2 new, 1 fixed');
    });

    it('reports only fixed findings', () => {
      expect(formatChange(comparison({ fixedCount: 3 }))).toBe('3 fixed');
    });

    it('reports no change', () => {
      expect(formatChange(comparison())).toBe('no change');
    });
  });

  describe('renderComparisonTable', () => {
    it('renders a row per tool, using n/a for missing counts', () => {
      const table = renderComparisonTable([
        comparison({ branchCount: 2, fixedCount: 2, stagingCount: 4 }),
        comparison({
          branchCount: null,
          note: 'no report produced for this branch',
          stagingCount: null,
          tool: 'trivy-image',
        }),
      ]);
      expect(table).toBe(
        [
          COMPARISON_TABLE_HEADER,
          COMPARISON_TABLE_DIVIDER,
          '| trivy-fs | 4 | 2 | 2 fixed |',
          '| trivy-image | n/a | n/a | no report produced for this branch |',
        ].join('\n'),
      );
    });
  });

  describe('formatFinding', () => {
    it('lists the rule, file, package, installed version and severity', () => {
      expect(formatFinding(finding())).toBe(
        '- `CVE-2026-102278` in `package-lock.json` (package `brace-expansion`, installed 5.0.9, HIGH)',
      );
    });

    it('lists only the rule and file when the result carries no package details', () => {
      expect(
        formatFinding(
          finding({ installedVersion: '', packageName: '', severity: '' }),
        ),
      ).toBe('- `CVE-2026-102278` in `package-lock.json`');
    });
  });

  describe('renderFindings', () => {
    const lodash = finding({
      installedVersion: '4.17.15',
      packageName: 'lodash',
      ruleId: 'CVE-2020-8203',
    });
    const comparisons = [
      comparison(),
      comparison({
        existingFindings: [finding()],
        newFindings: [lodash],
        tool: 'trivy-image',
      }),
    ];

    it('lists the new findings under each tool that has them, marked as blocking', () => {
      expect(renderFindings(comparisons, 'newFindings')).toBe(
        [
          `**trivy-image**: 1 ${FINDINGS_HEADINGS.newFindings}`,
          '',
          '- `CVE-2020-8203` in `package-lock.json` (package `lodash`, installed 4.17.15, HIGH)',
        ].join('\n'),
      );
    });

    it('lists the findings already on staging under each tool that has them, marked as not blocking', () => {
      expect(renderFindings(comparisons, 'existingFindings')).toBe(
        [
          `**trivy-image**: 1 ${FINDINGS_HEADINGS.existingFindings}`,
          '',
          '- `CVE-2026-102278` in `package-lock.json` (package `brace-expansion`, installed 5.0.9, HIGH)',
        ].join('\n'),
      );
    });

    it('returns an empty string when no tool has findings of that kind', () => {
      expect(renderFindings([comparison()], 'newFindings')).toBe('');
    });
  });
});
