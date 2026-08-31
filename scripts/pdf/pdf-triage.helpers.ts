import type {
  CrossReferenceIntegrity,
  CrossReferenceStatus,
} from './crossReference.helpers';
import type { DuplicateReport } from './pdf-doctor.helpers';

/**
 * Batch triage of local documents, for working through a folder of files
 * pulled out of an audit.
 *
 * A local file can be read in full, so every document gets both verdicts: the
 * byte-level one from its cross-reference section, and the definitive one from
 * enumerating its objects. This is the same settling `--deep` performs against
 * S3, without the download.
 */

export type TriageStatus = CrossReferenceStatus | 'UNREADABLE';

export type TriageRow = {
  duplicates: string;
  file: string;
  reason: string;
  status: TriageStatus;
};

export type TriageOutcome = {
  duplicates: string;
  reason: string;
  status: TriageStatus;
};

/** Renders a duplicate survey as `objectNumber:/Type`, space separated. */
export const formatDuplicateObjects = (report: DuplicateReport): string =>
  report.duplicates
    .map(
      duplicate =>
        `${duplicate.objectNumber}:${duplicate.objectType ? `/${duplicate.objectType}` : 'untyped'}`,
    )
    .join(' ');

/**
 * Settles a byte-level verdict against what a full read of the document found.
 *
 * Enumerating objects does not depend on byte offsets being trustworthy, so it
 * is the stronger evidence and decides a candidate either way. Pass a null
 * report when pdf-lib could not load the file: that is a finding in itself, so
 * the byte-level verdict stands rather than being cleared.
 *
 * The two can disagree in one direction worth surfacing. pdf-lib recovers a
 * broken section by rescanning, so it may load a document whose stored bytes
 * are misattributed and report no duplicate. The stored file is still the
 * damaged thing a reader will open, so the accusation stands and the conflict
 * is reported.
 */
export const settleWithFullRead = (
  integrity: CrossReferenceIntegrity,
  report: DuplicateReport | null,
): TriageOutcome => {
  if (!report) {
    return {
      duplicates: '',
      reason: `pdf-lib could not load this file; the cross-reference section says: ${integrity.reason}`,
      status: integrity.status === 'VALID' ? 'UNREADABLE' : integrity.status,
    };
  }

  const duplicates = formatDuplicateObjects(report);

  if (report.duplicates.length) {
    return {
      duplicates,
      reason: `a full read found ${report.duplicates.length} duplicated object number(s)`,
      status: 'DUPLICATED',
    };
  }

  if (integrity.status === 'DUPLICATED') {
    return {
      duplicates,
      reason: `the cross-reference section is misattributed but a full read found no duplicate, which means pdf-lib rebuilt the section on load - the stored file is still the damaged one a reader opens`,
      status: 'DUPLICATED',
    };
  }

  if (integrity.status === 'RESIDUE') {
    return {
      duplicates,
      reason: 'a full read found no duplicated object number',
      status: 'VALID',
    };
  }

  return { duplicates, reason: integrity.reason, status: integrity.status };
};

/** Counts verdicts, worst first, so the headline is the first line. */
export const summarizeTriage = (
  rows: TriageRow[],
): { count: number; status: TriageStatus }[] => {
  const order: TriageStatus[] = [
    'DUPLICATED',
    'RESIDUE',
    'INDETERMINATE',
    'UNREADABLE',
    'VALID',
  ];
  const counts = new Map<TriageStatus, number>();

  for (const row of rows) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([status, count]) => ({ count, status }))
    .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
};

/** One aligned line per document, sized to the longest filename. */
export const formatTriageTable = (rows: TriageRow[]): string[] => {
  const fileWidth = Math.max(4, ...rows.map(row => row.file.length));
  const statusWidth = Math.max(...rows.map(row => row.status.length));

  return [
    `${'file'.padEnd(fileWidth)}  ${'verdict'.padEnd(statusWidth)}  duplicated objects`,
    ...rows.map(
      row =>
        `${row.file.padEnd(fileWidth)}  ${row.status.padEnd(statusWidth)}  ${row.duplicates || '-'}`,
    ),
  ];
};
