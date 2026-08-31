import {
  type CrossReferenceIntegrity,
  OBJECT_HEADER_PROBE_BYTES,
  START_XREF_SCAN_BYTES,
  inspectCrossReferenceSection,
  locateCrossReferenceSection,
  settleResidue,
} from './crossReference.helpers';
import { type DuplicateObjectNumber } from './pdf-doctor.helpers';

/**
 * Surveys stored documents for the cross-reference defect described in
 * `pdf-doctor.helpers.ts`, without downloading them.
 *
 * The verdict depends only on the cross-reference section and the trailer,
 * both of which sit at the end of a document. Two range requests — the final
 * `START_XREF_SCAN_BYTES` to read `startxref`, then the section it points at —
 * answer the question in roughly 60KB regardless of how large the document is.
 * No page content, image data or embedded text is ever transferred, which
 * keeps a survey of court documents proportionate as well as cheap.
 *
 * Documents the generation screen flags need one more read each — a few dozen
 * bytes at the flagged entry's own offset — to tell a real duplicate from a
 * sound reuse of an object number. That is the only case where the survey
 * reaches into the body of a document, and it reads an object header there,
 * never content. On a corpus where the screen flags a minority it costs
 * almost nothing; see `confirmResidue` in `pdf-doctor.helpers.ts`.
 *
 * A note on what a hit means: `judge` in `pdf-doctor.helpers.ts` returns
 * INDETERMINATE for any incrementally updated document before it looks at
 * generation numbers, so a `DUPLICATED` verdict is only ever reached on a
 * single-revision file — and only after a header at a known offset has been
 * seen to name the wrong object. Each hit is therefore evidence of a
 * non-conforming rewrite rather than of an unusual source document.
 *
 * The screen reads generation numbers rather than comparing the entry count
 * against `/Size`, so a document with unused object numbers is not mistaken
 * for a damaged one and a gap cannot mask a real duplicate.
 */

/** Fetches one byte range of a single stored object. */
export type RangeReader = (
  range: string,
) => Promise<{ bytes: Uint8Array; contentRange?: string }>;

export type AuditOutcome = CrossReferenceIntegrity & {
  bytesRead: number;
  requests: number;
};

/** The tail request that locates `startxref`. */
export const TAIL_RANGE = `bytes=-${START_XREF_SCAN_BYTES}`;

/**
 * Reads the document's total length from a `Content-Range` response header,
 * which a range request reports as `bytes <from>-<to>/<total>`. Returns null
 * for the `bytes <from>-<to>/*` form, where the total is unknown.
 */
export const parseContentRange = (header?: string): number | null => {
  const match = header ? /\/(\d+)\s*$/.exec(header) : null;

  return match ? Number(match[1]) : null;
};

/**
 * Judges one stored document from range requests alone.
 *
 * Issues a second request only when the cross-reference section lies outside
 * the tail already fetched, which for a small document it usually does not.
 */
export const auditDocument = async (
  readRange: RangeReader,
): Promise<AuditOutcome> => {
  const tail = await readRange(TAIL_RANGE);
  let requests = 1;
  let bytesRead = tail.bytes.length;

  const documentLength =
    parseContentRange(tail.contentRange) ?? tail.bytes.length;

  const { offset, reason } = locateCrossReferenceSection(
    tail.bytes,
    documentLength,
  );
  if (offset === null) {
    return {
      bytesRead,
      coverageComplete: false,
      displacedObjectNumber: null,
      entryCount: null,
      overDeclaredBy: 0,
      probes: [],
      residue: [],
      reason,
      requests,
      size: null,
      status: 'INDETERMINATE',
    };
  }

  const tailStart = documentLength - tail.bytes.length;
  let sectionBytes: Uint8Array;
  if (offset >= tailStart) {
    sectionBytes = tail.bytes.subarray(offset - tailStart);
  } else {
    const section = await readRange(`bytes=${offset}-`);
    requests += 1;
    bytesRead += section.bytes.length;
    sectionBytes = section.bytes;
  }

  const screened = inspectCrossReferenceSection(sectionBytes);
  if (screened.status !== 'RESIDUE') {
    return { bytesRead, requests, ...screened };
  }

  // The screen found entries above generation zero. Reading the object header
  // each one points at is what separates a duplicated object number from a
  // sound reuse, and the two are indistinguishable in the trailing bytes.
  const headers = new Map<number, Uint8Array>();
  for (const { entryOffset } of screened.probes) {
    const probe = await readRange(
      `bytes=${entryOffset}-${entryOffset + OBJECT_HEADER_PROBE_BYTES - 1}`,
    );
    requests += 1;
    bytesRead += probe.bytes.length;
    headers.set(entryOffset, probe.bytes);
  }

  return { bytesRead, requests, ...settleResidue(screened, headers) };
};

/**
 * Runs `worker` over every item, with at most `limit` in flight. A survey is
 * dominated by request latency rather than by work, so serial execution would
 * take hours where a modest concurrency takes minutes.
 */
export const mapWithConcurrency = async <T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let cursor = 0;

  const runners = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      for (;;) {
        const index = cursor;
        cursor += 1;
        if (index >= items.length) {
          return;
        }
        results[index] = await worker(items[index]);
      }
    },
  );

  await Promise.all(runners);

  return results;
};

export const AUDIT_COLUMNS = [
  'documentStorageId',
  'createdAt',
  'eventCode',
  'isAutoGenerated',
  'status',
  'size',
  'entryCount',
  'residue',
  'displacedObjectNumber',
  'duplicateTypes',
  'reason',
] as const;

/** Renders one CSV record, quoting only the fields that require it. */
export const toCsvLine = (
  values: (boolean | number | string | null | undefined)[],
): string =>
  values
    .map(value => {
      const text = value === null || value === undefined ? '' : String(value);

      return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    })
    .join(',');

/**
 * Renders the deep survey as `objectNumber:/Type`, space separated. The object
 * numbers alone come free with the verdict; only the declared types need the
 * whole document, which is what `--deep` pays for.
 */
export const formatDuplicates = (duplicates: DuplicateObjectNumber[]): string =>
  duplicates
    .map(
      duplicate =>
        `${duplicate.objectNumber}:${duplicate.objectType ? `/${duplicate.objectType}` : 'untyped'}`,
    )
    .join(' ');

export type AuditSummary = {
  byMonth: { affected: number; month: string; total: number }[];
  byStatus: { count: number; status: string }[];
};

/**
 * Counts verdicts overall and by calendar month. The monthly breakdown is the
 * point of the survey: it shows whether affected documents predate a given
 * change or appeared alongside it.
 */
export const summarize = (
  rows: { createdAt: string; status: string }[],
): AuditSummary => {
  const statuses = new Map<string, number>();
  const months = new Map<string, { affected: number; total: number }>();

  for (const row of rows) {
    statuses.set(row.status, (statuses.get(row.status) ?? 0) + 1);

    const month = row.createdAt.slice(0, 7);
    const bucket = months.get(month) ?? { affected: 0, total: 0 };
    bucket.total += 1;
    if (row.status === 'DUPLICATED') {
      bucket.affected += 1;
    }
    months.set(month, bucket);
  }

  return {
    byMonth: [...months.entries()]
      .map(([month, counts]) => ({ ...counts, month }))
      .sort((a, b) => a.month.localeCompare(b.month)),
    byStatus: [...statuses.entries()]
      .map(([status, count]) => ({ count, status }))
      .sort((a, b) => b.count - a.count),
  };
};
