import { existsSync, readFileSync } from 'fs';

export type SarifDocument = {
  runs?: {
    results?: unknown[];
  }[];
};

export type ToolComparison = {
  branchCount: number | null;
  note?: string;
  regression: boolean;
  stagingCount: number | null;
  tool: string;
};

export const COMPARISON_TABLE_HEADER =
  '| Tool | Staging | This branch | Change |';
export const COMPARISON_TABLE_DIVIDER = '| --- | --- | --- | --- |';

/** Counts results across every run in a SARIF document. */
export const countSarifResults = (contents: string): number => {
  let document: SarifDocument;
  try {
    document = JSON.parse(contents);
  } catch {
    throw new Error('SARIF report is not valid JSON');
  }
  const runs = document.runs ?? [];
  return runs.reduce((total, run) => total + (run.results ?? []).length, 0);
};

/** Returns null when the report is absent, so a missing scan is not read as zero findings. */
export const readSarifCount = (filePath: string): number | null => {
  if (!existsSync(filePath)) {
    return null;
  }
  return countSarifResults(readFileSync(filePath, 'utf-8'));
};

export const compareToolFindings = ({
  branchCount,
  stagingCount,
  tool,
}: {
  branchCount: number | null;
  stagingCount: number | null;
  tool: string;
}): ToolComparison => {
  if (branchCount === null) {
    return {
      branchCount,
      note: 'no report produced for this branch',
      regression: false,
      stagingCount,
      tool,
    };
  }
  if (stagingCount === null) {
    return {
      branchCount,
      note: 'no staging baseline to compare against',
      regression: false,
      stagingCount,
      tool,
    };
  }
  return {
    branchCount,
    regression: branchCount > stagingCount,
    stagingCount,
    tool,
  };
};

export const hasRegressions = (comparisons: ToolComparison[]): boolean =>
  comparisons.some(comparison => comparison.regression);

export const formatChange = (comparison: ToolComparison): string => {
  const { branchCount, note, regression, stagingCount } = comparison;
  if (note) {
    return note;
  }
  const delta = (branchCount as number) - (stagingCount as number);
  if (regression) {
    return `+${delta} new`;
  }
  if (delta === 0) {
    return 'no change';
  }
  return `${delta} fewer`;
};

export const renderComparisonTable = (
  comparisons: ToolComparison[],
): string => {
  const rows = comparisons.map(comparison => {
    const staging = comparison.stagingCount ?? 'n/a';
    const branch = comparison.branchCount ?? 'n/a';
    return `| ${comparison.tool} | ${staging} | ${branch} | ${formatChange(comparison)} |`;
  });
  return [COMPARISON_TABLE_HEADER, COMPARISON_TABLE_DIVIDER, ...rows].join(
    '\n',
  );
};
