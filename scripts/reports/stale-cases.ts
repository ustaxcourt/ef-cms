// usage:
// npx ts-node --transpile-only scripts/reports/stale-cases.ts

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { appendFileSync } from 'fs';
import {
  calculateDifferenceInDays,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import {
  search,
  searchAll,
} from '@web-api/persistence/elasticsearch/searchClient';
import PQueue from 'p-queue';

const todayISO = createISODateString();
const OUTPUT_DIR = `${process.env.HOME}/Documents`;
const OUTPUT_FILENAME = `${OUTPUT_DIR}/stale-cases_${todayISO.split('T')[0]}.csv`;
const CHUNK_SIZE = 50;
const staleCases = {};

const excludedCaseStatuses = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.onAppeal,
];

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
  if (deAge > 364) {
    const judge = aCase.associatedJudge
      ?.replace('Chief Special Trial ', '')
      .replace('Special Trial ', '')
      .replace('Judge ', '');
    staleCases[aCase.docketNumber] = {
      caption: aCase.caseCaption,
      deAge,
      deRcvdAt: deRcvdAt!.split('T')[0],
      docketNumber: aCase.docketNumber,
      judge,
      status: aCase.status,
    };
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
  const queue = new PQueue({ concurrency: CHUNK_SIZE });
  const funcs = casesNotClosedOrOnAppeal.map(
    (aCase: RawCase) => async () =>
      await isCaseStale({ aCase, applicationContext }),
  );
  await queue.addAll(funcs);

  console.log(`Found ${Object.keys(staleCases).length} stale cases.`);

  console.log(`Writing CSV to ${OUTPUT_FILENAME}...`);
  let output =
    '"Docket Number","Case Caption","Case Status","Judge",' +
    '"Last Document Filed On","Last Document Filed Age in Days"';
  for (const docketNumber in staleCases) {
    output +=
      `\n"${docketNumber}","${staleCases[docketNumber].caption}",` +
      `"${staleCases[docketNumber].status}","${staleCases[docketNumber].judge}",` +
      `"${staleCases[docketNumber].deRcvdAt}","${staleCases[docketNumber].deAge}"`;
  }
  appendFileSync(OUTPUT_FILENAME, output);
})();
