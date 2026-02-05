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
import { formatCaseCaption, formatJudgeName } from '../helpers/formatters';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';
import { generateCsv } from '../helpers/generate-csv';
import { getDbReader } from '@web-api/database';
import { pick } from 'lodash';

const todayISO = createISODateString();
const YEAR_IN_DAYS = 365;
const excludedCaseStatuses = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.onAppeal,
];

type RawCaseWithLastFilingDate = RawCase & { lastFilingDate?: Date };
type StaleCase = {
  caption: string;
  deAge: number;
  docketNumber: string;
  judge: string;
  lastFilingDate: string;
  preferredTrialCity: string;
  status: CaseStatus;
};

const getAllCasesNotInExcludedStatus = async (): Promise<
  RawCaseWithLastFilingDate[]
> => {
  const oneYearAgo = getJsDateFromIso(
    subtractISODates(todayISO, { day: YEAR_IN_DAYS }),
  );
  return await getDbReader(async reader => {
    const results = await reader
      .selectFrom('dwCase as c')
      .selectAll('c')
      .select(eb => [
        eb
          .selectFrom('dwDocketEntry as de')
          .select('de.filingDate')
          .whereRef('de.docketNumber', '=', 'c.docketNumber')
          .where('de.isDraft', '!=', true)
          .where('de.filingDate', 'is not', null)
          .orderBy('de.filingDate', 'desc')
          .limit(1)
          .as('lastFilingDate'),
      ])
      .where('c.status', 'not in', excludedCaseStatuses)
      .where('c.receivedAt', '<=', oneYearAgo)
      .orderBy('c.sortableDocketNumber', 'asc')
      .execute();

    return results.map(record => ({
      ...fromKyselyCase(record),
      lastFilingDate: record.lastFilingDate || undefined,
    })) as RawCaseWithLastFilingDate[];
  });
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

  const staleCases: StaleCase[] = [];

  for (const aCase of casesNotClosedOrOnAppeal) {
    const deFiled = aCase.lastFilingDate?.toISOString();
    const deAge = deFiled ? calculateDifferenceInDays(todayISO, deFiled) : 0;
    if (deAge >= YEAR_IN_DAYS) {
      staleCases.push({
        ...pick(aCase, ['docketNumber', 'status']),
        caption: formatCaseCaption(aCase.caseCaption),
        deAge,
        judge: formatJudgeName(aCase.associatedJudge),
        lastFilingDate: deFiled!.split('T')[0],
        preferredTrialCity: aCase.preferredTrialCity || '',
      });
      console.log(
        `Docket number ${aCase.docketNumber} is stale! Most recent document ` +
          `is ${deAge} days old, last filed on ${deFiled!.split('T')[0]}`,
      );
    }
  }

  console.log(`Found ${staleCases.length} stale cases.`);

  console.log(`Writing CSV to ${filename}...`);
  const columns = [
    { header: 'Judge', key: 'judge' },
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Caption', key: 'caption' },
    { header: 'Status', key: 'status' },
    { header: 'Last Filed', key: 'lastFilingDate' },
    { header: 'Age in Days', key: 'deAge' },
    { header: 'Preferred Trial City', key: 'preferredTrialCity' },
  ];
  const rows = staleCases
    .sort((a, b) => b.deAge - a.deAge)
    .sort((a, b) => compareStrings(a.judge, b.judge));
  generateCsv({ columns, filename, rows });
};
