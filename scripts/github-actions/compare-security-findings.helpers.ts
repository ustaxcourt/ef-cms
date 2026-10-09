import { existsSync, readFileSync } from 'fs';

export type SarifResult = {
  locations?: {
    physicalLocation?: {
      artifactLocation?: { uri?: string };
      region?: { startLine?: number };
    };
  }[];
  message?: { text?: string };
  ruleId?: string;
};

export type SarifDocument = {
  runs?: {
    results?: SarifResult[];
  }[];
};

export type Finding = {
  installedVersion: string;
  packageName: string;
  ruleId: string;
  severity: string;
  uri: string;
};

export type ToolComparison = {
  branchCount: number | null;
  existingFindings: Finding[];
  fixedCount: number;
  newFindings: Finding[];
  note?: string;
  regression: boolean;
  stagingCount: number | null;
  tool: string;
};

export const COMPARISON_TABLE_HEADER =
  '| Tool | Staging | This branch | Change |';
export const COMPARISON_TABLE_DIVIDER = '| --- | --- | --- | --- |';

/** Reads a `Name: value` line from a Trivy result message, or '' when absent. */
export const readMessageField = (message: string, field: string): string => {
  const line = message
    .split('\n')
    .find(candidate => candidate.startsWith(`${field}:`));
  return line ? line.slice(field.length + 1).trim() : '';
};

export const toFinding = (result: SarifResult): Finding => {
  const message = result.message?.text ?? '';
  return {
    installedVersion: readMessageField(message, 'Installed Version'),
    packageName: readMessageField(message, 'Package'),
    ruleId: result.ruleId ?? '(none)',
    severity: readMessageField(message, 'Severity'),
    uri:
      result.locations?.[0]?.physicalLocation?.artifactLocation?.uri ??
      '(unknown location)',
  };
};

/**
 * Identifies a finding by what it is, not where it sits: line numbers move whenever a
 * lockfile changes, and a version bump that leaves the same CVE open is not a new finding.
 */
export const findingKey = (finding: Finding): string =>
  [finding.ruleId, finding.packageName, finding.uri].join('|');

/** Lists the findings across every run in a SARIF document. */
export const extractFindings = (contents: string): Finding[] => {
  let document: SarifDocument;
  try {
    document = JSON.parse(contents);
  } catch {
    throw new Error('SARIF report is not valid JSON');
  }
  const runs = document.runs ?? [];
  return runs.flatMap(run => (run.results ?? []).map(toFinding));
};

/** Returns null when the report is absent, so a missing scan is not read as zero findings. */
export const readSarifFindings = (filePath: string): Finding[] | null => {
  if (!existsSync(filePath)) {
    return null;
  }
  return extractFindings(readFileSync(filePath, 'utf-8'));
};

const uniqueByKey = (findings: Finding[]): Map<string, Finding> =>
  new Map(findings.map(finding => [findingKey(finding), finding]));

export const compareToolFindings = ({
  branchFindings,
  stagingFindings,
  tool,
}: {
  branchFindings: Finding[] | null;
  stagingFindings: Finding[] | null;
  tool: string;
}): ToolComparison => {
  const branch = branchFindings ? uniqueByKey(branchFindings) : null;
  const staging = stagingFindings ? uniqueByKey(stagingFindings) : null;
  const counts = {
    branchCount: branch?.size ?? null,
    stagingCount: staging?.size ?? null,
    tool,
  };

  if (!branch) {
    return {
      ...counts,
      existingFindings: [],
      fixedCount: 0,
      newFindings: [],
      note: 'no report produced for this branch',
      regression: false,
    };
  }
  if (!staging) {
    return {
      ...counts,
      existingFindings: [],
      fixedCount: 0,
      newFindings: [],
      note: 'no staging baseline to compare against',
      regression: false,
    };
  }

  const branchEntries = [...branch.entries()];
  const newFindings = branchEntries
    .filter(([key]) => !staging.has(key))
    .map(([, finding]) => finding);
  const existingFindings = branchEntries
    .filter(([key]) => staging.has(key))
    .map(([, finding]) => finding);
  const fixedCount = [...staging.keys()].filter(key => !branch.has(key)).length;

  return {
    ...counts,
    existingFindings,
    fixedCount,
    newFindings,
    regression: newFindings.length > 0,
  };
};

export const hasRegressions = (comparisons: ToolComparison[]): boolean =>
  comparisons.some(comparison => comparison.regression);

export const formatChange = (comparison: ToolComparison): string => {
  const { fixedCount, newFindings, note } = comparison;
  if (note) {
    return note;
  }
  const parts = [
    newFindings.length > 0 ? `${newFindings.length} new` : '',
    fixedCount > 0 ? `${fixedCount} fixed` : '',
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'no change';
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

export const formatFinding = (finding: Finding): string => {
  const details = [
    finding.packageName && `package \`${finding.packageName}\``,
    finding.installedVersion && `installed ${finding.installedVersion}`,
    finding.severity,
  ].filter(Boolean);
  const suffix = details.length > 0 ? ` (${details.join(', ')})` : '';
  return `- \`${finding.ruleId}\` in \`${finding.uri}\`${suffix}`;
};

export const FINDINGS_HEADINGS = {
  existingFindings: 'already on staging, does not block this pull request',
  newFindings: 'new on this branch, not on staging, blocks this pull request',
} as const;

/** Lists each tool's new or already-on-staging findings, or '' when no tool has any. */
export const renderFindings = (
  comparisons: ToolComparison[],
  kind: keyof typeof FINDINGS_HEADINGS,
): string =>
  comparisons
    .filter(comparison => comparison[kind].length > 0)
    .map(comparison =>
      [
        `**${comparison.tool}**: ${comparison[kind].length} ${FINDINGS_HEADINGS[kind]}`,
        '',
        ...comparison[kind].map(formatFinding),
      ].join('\n'),
    )
    .join('\n\n');
