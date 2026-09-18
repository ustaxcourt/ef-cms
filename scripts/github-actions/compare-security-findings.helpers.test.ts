jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));

import { existsSync, readFileSync } from 'fs';
import {
  COMPARISON_TABLE_DIVIDER,
  COMPARISON_TABLE_HEADER,
  compareToolFindings,
  countSarifResults,
  formatChange,
  hasRegressions,
  readSarifCount,
  renderComparisonTable,
  type ToolComparison,
} from './compare-security-findings.helpers';

describe('compare-security-findings.helpers', () => {
  describe('countSarifResults', () => {
    it('sums results across every run', () => {
      const sarif = JSON.stringify({
        runs: [{ results: [{}, {}] }, { results: [{}] }],
      });
      expect(countSarifResults(sarif)).toBe(3);
    });

    it('returns zero when a run has no results', () => {
      expect(countSarifResults(JSON.stringify({ runs: [{}] }))).toBe(0);
    });

    it('returns zero when the document has no runs', () => {
      expect(countSarifResults(JSON.stringify({}))).toBe(0);
    });

    it('throws when the report is not valid JSON', () => {
      expect(() => countSarifResults('not json')).toThrow(
        'SARIF report is not valid JSON',
      );
    });
  });

  describe('readSarifCount', () => {
    it('returns null when the report is missing', () => {
      (existsSync as jest.Mock).mockReturnValue(false);
      expect(readSarifCount('missing.sarif')).toBeNull();
    });

    it('counts the results when the report exists', () => {
      (existsSync as jest.Mock).mockReturnValue(true);
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify({ runs: [{ results: [{}, {}] }] }),
      );
      expect(readSarifCount('present.sarif')).toBe(2);
    });
  });

  describe('compareToolFindings', () => {
    it('does not fail when the branch produced no report', () => {
      expect(
        compareToolFindings({
          branchCount: null,
          stagingCount: 4,
          tool: 'trivy-fs',
        }),
      ).toEqual({
        branchCount: null,
        note: 'no report produced for this branch',
        regression: false,
        stagingCount: 4,
        tool: 'trivy-fs',
      });
    });

    it('does not fail when staging has no baseline', () => {
      expect(
        compareToolFindings({
          branchCount: 4,
          stagingCount: null,
          tool: 'trivy-fs',
        }),
      ).toEqual({
        branchCount: 4,
        note: 'no staging baseline to compare against',
        regression: false,
        stagingCount: null,
        tool: 'trivy-fs',
      });
    });

    it('flags a regression when the branch has more findings', () => {
      expect(
        compareToolFindings({
          branchCount: 5,
          stagingCount: 4,
          tool: 'trivy-fs',
        }).regression,
      ).toBe(true);
    });

    it('passes when the counts match', () => {
      expect(
        compareToolFindings({
          branchCount: 4,
          stagingCount: 4,
          tool: 'trivy-fs',
        }).regression,
      ).toBe(false);
    });
  });

  describe('hasRegressions', () => {
    const comparison = (regression: boolean): ToolComparison => ({
      branchCount: 1,
      regression,
      stagingCount: 1,
      tool: 'trivy-fs',
    });

    it('is true when any tool regressed', () => {
      expect(hasRegressions([comparison(false), comparison(true)])).toBe(true);
    });

    it('is false when no tool regressed', () => {
      expect(hasRegressions([comparison(false)])).toBe(false);
    });
  });

  describe('formatChange', () => {
    it('reports the note when one is present', () => {
      expect(
        formatChange({
          branchCount: null,
          note: 'no report produced for this branch',
          regression: false,
          stagingCount: 1,
          tool: 'trivy-fs',
        }),
      ).toBe('no report produced for this branch');
    });

    it('reports new findings', () => {
      expect(
        formatChange({
          branchCount: 6,
          regression: true,
          stagingCount: 4,
          tool: 'trivy-fs',
        }),
      ).toBe('+2 new');
    });

    it('reports no change', () => {
      expect(
        formatChange({
          branchCount: 4,
          regression: false,
          stagingCount: 4,
          tool: 'trivy-fs',
        }),
      ).toBe('no change');
    });

    it('reports fewer findings', () => {
      expect(
        formatChange({
          branchCount: 2,
          regression: false,
          stagingCount: 4,
          tool: 'trivy-fs',
        }),
      ).toBe('-2 fewer');
    });
  });

  describe('renderComparisonTable', () => {
    it('renders a row per tool, using n/a for missing counts', () => {
      const table = renderComparisonTable([
        {
          branchCount: 2,
          regression: false,
          stagingCount: 4,
          tool: 'trivy-fs',
        },
        {
          branchCount: null,
          note: 'no report produced for this branch',
          regression: false,
          stagingCount: null,
          tool: 'trivy-image',
        },
      ]);
      expect(table).toBe(
        [
          COMPARISON_TABLE_HEADER,
          COMPARISON_TABLE_DIVIDER,
          '| trivy-fs | 4 | 2 | -2 fewer |',
          '| trivy-image | n/a | n/a | no report produced for this branch |',
        ].join('\n'),
      );
    });
  });
});
