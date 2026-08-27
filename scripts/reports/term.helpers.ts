import {
  SESSION_TERMS_DICT,
  SESSION_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  type RawTrialSession,
  type TCaseOrder,
} from '@shared/business/entities/trialSessions/TrialSession';
import { formatJudgeName } from '../helpers/formatters';
import { generateCsv } from '../helpers/generate-csv';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getTrialSessions } from '@web-api/persistence/postgres/trialSessions/getTrialSessions';

const REPORT_TERMS = [
  SESSION_TERMS_DICT.WINTER,
  SESSION_TERMS_DICT.SPRING,
  SESSION_TERMS_DICT.FALL,
] as const;

const REPORT_SESSION_TYPES: readonly string[] = [
  SESSION_TYPES.regular,
  SESSION_TYPES.small,
  SESSION_TYPES.hybrid,
  SESSION_TYPES.hybridSmall,
] as const;

export type TermReportRow = {
  disposition: string;
  docketNumber: string;
  judge: string;
};

export type termReportRowsByLocation = Record<string, TermReportRow[]>;

type ReportCase = {
  docketNumber: string;
  leadDocketNumber?: string;
};

export const normalizeTerm = (term: string): string => {
  const normalizedTerm = REPORT_TERMS.find(
    reportTerm => reportTerm.toLowerCase() === term.toLowerCase(),
  );
  if (!normalizedTerm) {
    throw new Error(
      `Invalid term "${term}". Expected ${REPORT_TERMS.join(', ')}.`,
    );
  }
  return normalizedTerm;
};

const isReportSession = (
  session: RawTrialSession,
  term: string,
  termYear: string,
): boolean => {
  if (!session.isCalendared) return false;
  if (!REPORT_SESSION_TYPES.includes(session.sessionType)) return false;
  if (session.term.toLowerCase() !== term.toLowerCase()) return false;
  return session.termYear === termYear;
};

const getReportSessions = ({
  sessions,
  term,
  termYear,
}: {
  sessions: RawTrialSession[];
  term: string;
  termYear: string;
}): RawTrialSession[] =>
  sessions.filter(session => isReportSession(session, term, termYear));

const toReportRows = (
  sessions: RawTrialSession[],
  cases: ReportCase[],
  seenReportDockets = new Set<string>(),
): TermReportRow[] =>
  sessions.flatMap(session => {
    const casesByDocketNumber = new Map(
      cases.map(caseItem => [caseItem.docketNumber, caseItem]),
    );
    const caseOrdersByReportDocket = new Map<string, TCaseOrder>();

    session.caseOrder.forEach(caseOrder => {
      const reportDocketNumber =
        casesByDocketNumber.get(caseOrder.docketNumber)?.leadDocketNumber ??
        caseOrder.docketNumber;
      const existingCaseOrder =
        caseOrdersByReportDocket.get(reportDocketNumber);

      if (!existingCaseOrder || caseOrder.docketNumber === reportDocketNumber) {
        caseOrdersByReportDocket.set(reportDocketNumber, caseOrder);
      }
    });

    return [...caseOrdersByReportDocket.entries()].flatMap(
      ([docketNumber, caseOrder]) => {
        if (seenReportDockets.has(docketNumber)) return [];
        // The first matching session owns the group's report details.
        seenReportDockets.add(docketNumber);
        return [
          {
            disposition: caseOrder.disposition ?? '',
            docketNumber,
            judge: formatJudgeName(session.judge?.name),
          },
        ];
      },
    );
  });

export const getTermRows = ({
  sessions,
  term,
  termYear,
  cases = [],
}: {
  sessions: RawTrialSession[];
  term: string;
  termYear: string;
  cases?: ReportCase[];
}): TermReportRow[] => {
  const normalizedTerm = normalizeTerm(term);
  const matchingSessions = getReportSessions({
    sessions,
    term: normalizedTerm,
    termYear,
  });
  return toReportRows(matchingSessions, cases).sort((a, b) =>
    a.disposition.localeCompare(b.disposition),
  );
};

export const getTermRowsByLocation = ({
  sessions,
  term,
  termYear,
  cases = [],
}: {
  sessions: RawTrialSession[];
  term: string;
  termYear: string;
  cases?: ReportCase[];
}): termReportRowsByLocation => {
  const normalizedTerm = normalizeTerm(term);
  const rowsByLocation: termReportRowsByLocation = {};
  const reportSessions = getReportSessions({
    sessions,
    term: normalizedTerm,
    termYear,
  });
  const seenReportDockets = new Set<string>();

  reportSessions.forEach(session => {
    const location = session.trialLocation || 'Unknown';
    const sessionRows = toReportRows([session], cases, seenReportDockets);
    if (!sessionRows.length) return;
    rowsByLocation[location] = [
      ...(rowsByLocation[location] || []),
      ...sessionRows,
    ];
  });

  Object.values(rowsByLocation).forEach(locationRows =>
    locationRows.sort((a, b) => a.disposition.localeCompare(b.disposition)),
  );
  return rowsByLocation;
};

const toFilenamePart = (location: string): string =>
  location
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const termReport = async ({
  outputDir,
  term,
  termYear,
}: {
  outputDir: string;
  term: string;
  termYear: string;
}): Promise<void> => {
  const normalizedTerm = normalizeTerm(term);
  console.log(`Starting term report for ${normalizedTerm} ${termYear}.`);
  console.log('Retrieving trial sessions...');
  const sessions = await getTrialSessions();
  console.log(`Retrieved ${sessions.length} trial sessions.`);
  const reportSessions = getReportSessions({
    sessions,
    term: normalizedTerm,
    termYear,
  });
  console.log(
    `Matched ${reportSessions.length} calendared trial sessions for ` +
      `${normalizedTerm} ${termYear} using session types ` +
      `${REPORT_SESSION_TYPES.join(', ')}.`,
  );
  const docketNumbers = [
    ...new Set(
      reportSessions.flatMap(session =>
        session.caseOrder.map(caseOrder => caseOrder.docketNumber),
      ),
    ),
  ];
  console.log(
    `Retrieving case data for ${docketNumbers.length} linked docket numbers...`,
  );
  const cases = docketNumbers.length
    ? await getCasesByDocketNumbers({
        docketNumbers,
        excludeFields: [
          'docketEntries',
          'privatePractitioners',
          'irsPractitioners',
          'correspondence',
          'hearings',
        ],
      })
    : [];
  console.log(`Retrieved ${cases.length} case records.`);
  reportSessions.forEach(session => {
    console.log(
      `Session ${session.trialSessionId}: ` +
        `${session.trialLocation || 'Unknown'} | ${session.startDate} | ` +
        `${session.sessionType} | Judge: ` +
        `${formatJudgeName(session.judge?.name) || 'Unknown'} | ` +
        `Cases: ${session.caseOrder.length} linked.`,
    );
  });

  const rowsByLocation = getTermRowsByLocation({
    sessions: reportSessions,
    term: normalizedTerm,
    termYear,
    cases,
  });
  const totalRows = Object.values(rowsByLocation).reduce(
    (count, rows) => count + rows.length,
    0,
  );
  console.log(
    `Found ${totalRows} linked cases across ` +
      `${Object.keys(rowsByLocation).length} locations.`,
  );
  if (!totalRows) {
    console.log('No CSV files will be generated because there are no rows.');
  }

  const columns = [
    { header: 'Judge', key: 'judge' },
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Disposition', key: 'disposition' },
  ];

  Object.entries(rowsByLocation).forEach(([location, rows]) => {
    console.log(`Writing ${rows.length} rows for ${location}.`);
    const filename =
      `${outputDir}/term-${normalizedTerm.toLowerCase()}-` +
      `${termYear}-${toFilenamePart(location)}.csv`;
    generateCsv({ columns, filename, rows });
    console.log(`Generated ${filename}`);
  });
};
