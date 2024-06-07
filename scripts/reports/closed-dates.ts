// usage: npx ts-node --transpile-only scripts/reports/closed-dates.ts 2022

import { DateTime } from 'luxon';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { appendFileSync } from 'fs';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';
import { validateDateAndCreateISO } from '@shared/business/utilities/DateHandler';

const year = process.argv[2] || `${DateTime.now().toObject().year}`;
const OUTPUT_DIR = `${process.env.HOME}/Documents`;

const getAllCasesOpenedInYear = async ({
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
                  'entityName.S': {
                    value: 'Case',
                  },
                },
              },
              {
                range: {
                  'receivedAt.S': {
                    gte: validateDateAndCreateISO({
                      day: '1',
                      month: '1',
                      year,
                    }),
                    lt: validateDateAndCreateISO({
                      day: '1',
                      month: '1',
                      year: String(Number(year) + 1),
                    }),
                  },
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

const outputCsv = ({
  casesOpenedInYear,
  filename,
}: {
  casesOpenedInYear: RawCase[];
  filename: string;
}): void => {
  let output =
    '"Docket Number","Date Created","Date Closed","Case Title",' +
    '"Case Status","Case Type"';
  for (const c of casesOpenedInYear) {
    const rcvdAtHumanized = c.receivedAt.split('T')[0];
    const closedHumanized = c.closedDate?.split('T')[0] || '';
    output +=
      `\n"${c.docketNumber}","${rcvdAtHumanized}","${closedHumanized}",` +
      `"${c.caseCaption}","${c.status}","${c.caseType}"`;
  }
  appendFileSync(`${OUTPUT_DIR}/${filename}`, output);
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const casesOpenedInYear = await getAllCasesOpenedInYear({
    applicationContext,
  });
  const filename = `closed-dates-of-cases-opened-in-${year}.csv`;
  outputCsv({ casesOpenedInYear, filename });
  console.log(`Generated ${OUTPUT_DIR}/${filename}`);
})();
