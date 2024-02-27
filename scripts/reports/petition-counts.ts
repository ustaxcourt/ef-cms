// usage: npx ts-node --transpile-only scripts/reports/petition-counts.js 2022

import { DateTime } from 'luxon';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  dateStringsCompared,
  validateDateAndCreateISO,
} from '@shared/business/utilities/DateHandler';
import { searchAll } from '@web-api/persistence/elasticsearch/searchClient';

const year = process.argv[2] || String(DateTime.now().toObject().year);

const getAllPetitions = async ({
  applicationContext,
}: {
  applicationContext: IApplicationContext;
}): Promise<RawDocketEntry[]> => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  'eventCode.S': 'P',
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
        sort: [{ 'receivedAt.S': 'asc' }],
      },
      index: 'efcms-docket-entry',
    },
  });
  return results;
};

const getCounts = ({
  gte,
  lt,
  petitions,
}: {
  gte: string;
  lt: string;
  petitions: RawDocketEntry[];
}): { isElectronic: number; isPaper: number } => {
  const petitionsReceivedInTimeframe = petitions.filter(
    p =>
      dateStringsCompared(p.receivedAt, gte) >= 0 &&
      dateStringsCompared(p.receivedAt, lt) < 0,
  );
  return {
    isElectronic: petitionsReceivedInTimeframe.filter(
      p => !('isPaper' in p) || !p.isPaper,
    ).length,
    isPaper: petitionsReceivedInTimeframe.filter(
      p => 'isPaper' in p && p.isPaper,
    ).length,
  };
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const applicationContext = createApplicationContext({});
  const petitions = await getAllPetitions({ applicationContext });
  const start = DateTime.fromISO(`${year}-01-01`);

  for (let month = 0; month < 12; month++) {
    const [gte, lt] = [
      start.plus({ months: month }),
      start.plus({ months: month + 1 }),
    ];
    const { isElectronic, isPaper } = getCounts({
      gte: gte.toISO()!,
      lt: lt.toISO()!,
      petitions,
    });
    console.log(
      [
        gte.toLocaleString(),
        isElectronic,
        isPaper,
        isElectronic + isPaper,
      ].join(','),
    );
  }
})();
