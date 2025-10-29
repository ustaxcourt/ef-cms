import {
  CASE_STATUS_TYPES,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';
import {
  calculateDifferenceInDays,
  createISODateString,
  getJsDateFromIso,
  subtractISODates,
} from '@shared/business/utilities/DateHandler';
import { compareStrings } from '@shared/business/utilities/sortFunctions';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { fromKyselyDocketEntry } from '@web-api/persistence/postgres/docketEntries/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import PQueue from 'p-queue';

const todayISO = createISODateString();
const CONCURRENCY = 5;
const YEAR_IN_DAYS = 365;
const excludedCaseStatuses = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.onAppeal,
];

type StaleCase = {
  caption: string;
  deAge: number;
  deRcvdAt: string;
  docketNumber: string;
  judge: string;
  preferredTrialCity: string;
  status: CaseStatus;
};

const staleCases: StaleCase[] = [];

const getAllCasesNotInExcludedStatus = async (): Promise<RawCase[]> => {
  const oneYearAgo = getJsDateFromIso(
    subtractISODates(todayISO, { day: YEAR_IN_DAYS }),
  );
  return (
    await getDbReader(reader =>
      reader
        .selectFrom('dwCase as c')
        .selectAll('c')
        .where('c.status', 'not in', excludedCaseStatuses)
        .where('c.receivedAt', '<=', oneYearAgo)
        .orderBy('c.sortableDocketNumber', 'asc')
        .execute(),
    )
  ).map(fromKyselyCase) as RawCase[];
};

const getMostRecentDocketEntry = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawDocketEntry | undefined> => {
  const results = (
    await getDbReader(reader =>
      reader
        .selectFrom('dwDocketEntry as de')
        .selectAll('de')
        .where('de.docketNumber', '=', docketNumber)
        .where('de.isDraft', '!=', true)
        .where('de.filingDate', 'is not', null)
        .orderBy('de.receivedAt', 'desc')
        .limit(1)
        .execute(),
    )
  ).map(fromKyselyDocketEntry) as RawDocketEntry[];
  return results[0];
};

const isCaseStale = async ({ aCase }: { aCase: RawCase }): Promise<void> => {
  const mostRecentDocketEntry = await getMostRecentDocketEntry({
    docketNumber: aCase.docketNumber,
  });
  const deRcvdAt = mostRecentDocketEntry?.receivedAt;
  const deAge = deRcvdAt ? calculateDifferenceInDays(todayISO, deRcvdAt) : 0;
  if (deAge >= YEAR_IN_DAYS) {
    const judge =
      aCase.associatedJudge
        ?.replace('Chief Special Trial ', '')
        .replace('Special Trial ', '')
        .replace('Judge ', '') ?? '';
    staleCases.push({
      caption: aCase.caseCaption.replace(/\r\n|\r|\n/g, ' '),
      deAge,
      deRcvdAt: deRcvdAt!.split('T')[0],
      docketNumber: aCase.docketNumber,
      judge,
      preferredTrialCity: aCase.preferredTrialCity || '',
      status: aCase.status,
    });
    console.log(
      `Docket number ${aCase.docketNumber} is stale! Most recent document is` +
        ` ${deAge} days old, last filed on ${deRcvdAt!.split('T')[0]}`,
    );
  }
};

export const generateStaleCasesReport = async ({
  filename,
}: {
  filename: string;
}): Promise<void> => {
  const casesNotClosedOrOnAppeal = await getAllCasesNotInExcludedStatus();
  console.log(
    `Found ${casesNotClosedOrOnAppeal.length} cases not closed or on ` +
      'appeal that were received at least a year ago.',
  );
  const queue = new PQueue({ concurrency: CONCURRENCY });
  const funcs = casesNotClosedOrOnAppeal.map(
    (aCase: RawCase) => async () => await isCaseStale({ aCase }),
  );
  await queue.addAll(funcs);
  console.log(`Found ${staleCases.length} stale cases.`);

  console.log(`Writing CSV to ${filename}...`);
  const columns = [
    { header: 'Judge', key: 'judge' },
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Caption', key: 'caption' },
    { header: 'Status', key: 'status' },
    { header: 'Last Filed', key: 'deRcvdAt' },
    { header: 'Age in Days', key: 'deAge' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
  ];
  const rows = staleCases
    .sort((a, b) => b.deAge - a.deAge)
    .sort((a, b) => compareStrings(a.judge, b.judge));
  generateCsv({ columns, filename, rows });
};
