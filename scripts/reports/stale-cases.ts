// usage:
// npx ts-node --transpile-only scripts/reports/stale-cases.ts

import {
  CASE_STATUS_TYPES,
  CaseStatus,
} from '@shared/business/entities/EntityConstants';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { appendFileSync } from 'fs';
import {
  calculateDifferenceInDays,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { compareStrings } from '@shared/business/utilities/sortFunctions';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import PQueue from 'p-queue';

const todayISO = createISODateString();
const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/stale-cases_${todayISO.split('T')[0]}.csv`;
const CONCURRENCY = 50;
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
  status: CaseStatus;
};

const staleCases: StaleCase[] = [];

const getAllCasesNotInExcludedStatus = async ({
  applicationContext,
}: {
  applicationContext: ServerApplicationContext;
}): Promise<RawCase[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'Case',
                },
              },
            ],
            must_not: [
              {
                terms: {
                  'status.S': excludedCaseStatuses,
                },
              },
            ],
          },
        },
        sort: [{ 'sortableDocketNumber.N': 'asc' }],
      },
      index: 'efcms-case',
    },
  });
  return results;
};

const getMostRecentDocketEntry = async ({
  applicationContext,
  docketNumber,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
}): Promise<RawDocketEntry | undefined> => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        from: 0,
        query: {
          bool: {
            must: [
              {
                term: {
                  'entityName.S': 'DocketEntry',
                },
              },
              {
                term: {
                  'docketNumber.S': docketNumber,
                },
              },
            ],
          },
        },
        size: 1,
        sort: [{ 'receivedAt.S': 'desc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results[0];
};

const isCaseStale = async ({
  aCase,
  applicationContext,
}: {
  aCase: RawCase;
  applicationContext: ServerApplicationContext;
}): Promise<void> => {
  const mostRecentDocketEntry = await getMostRecentDocketEntry({
    applicationContext,
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
      status: aCase.status,
    });
    console.log(
      `Docket number ${aCase.docketNumber} is stale! Most recent document is` +
        ` ${deAge} days old, last filed on ${deRcvdAt!.split('T')[0]}`,
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});

  const casesNotClosedOrOnAppeal = await getAllCasesNotInExcludedStatus({
    applicationContext,
  });
  console.log(
    `Found ${casesNotClosedOrOnAppeal.length} cases not closed or on appeal.`,
  );
  const queue = new PQueue({ concurrency: CONCURRENCY });
  const funcs = casesNotClosedOrOnAppeal.map(
    (aCase: RawCase) => async () =>
      await isCaseStale({ aCase, applicationContext }),
  );
  await queue.addAll(funcs);
  console.log(`Found ${staleCases.length} stale cases.`);

  console.log(`Writing CSV to ${OUTPUT_FILENAME}...`);
  const sortedStaleCases = staleCases
    .sort((a, b) => b.deAge - a.deAge)
    .sort((a, b) => compareStrings(a.judge, b.judge));
  let output =
    '"Judge","Docket Number","Caption","Status","Last Filed","Age in Days"';
  for (const sc of sortedStaleCases) {
    output +=
      `\n"${sc.judge}","${sc.docketNumber}","${sc.caption}","${sc.status}",` +
      `"${sc.deRcvdAt}","${sc.deAge}"`;
  }
  appendFileSync(OUTPUT_FILENAME, output);
})();
