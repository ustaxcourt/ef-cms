// usage: npx ts-node --transpile-only scripts/reports/closed-dates.ts 2022

import { DateTime } from 'luxon';
import {
  ServerApplicationContext,
  createApplicationContext,
} from '@web-api/applicationContext';
import { generateCsv } from '../helpers/generate-csv';
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

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const casesOpenedInYear = await getAllCasesOpenedInYear({
    applicationContext,
  });
  const filename = `${OUTPUT_DIR}/closed-dates-of-cases-opened-in-${year}.csv`;
  const columns = [
    { header: 'Docket Number', key: 'docketNumber' },
    { header: 'Date Created', key: 'rcvdAtHumanized' },
    { header: 'Date Closed', key: 'closedHumanized' },
    { header: 'Case Title', key: 'caseCaption' },
    { header: 'Case Status', key: 'status' },
    { header: 'Case Type', key: 'caseType' },
  ];
  const rows = casesOpenedInYear.map(c => ({
    caseCaption: c.caseCaption,
    caseType: c.caseType,
    closedHumanized: c.closedDate?.split('T')[0] || '',
    docketNumber: c.docketNumber,
    rcvdAtHumanized: c.receivedAt.split('T')[0],
    status: c.status,
  }));
  generateCsv({ columns, filename, rows });
  console.log(`Generated ${filename}`);
})();
