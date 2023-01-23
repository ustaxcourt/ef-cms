// usage: npx ts-node shared/admin-tools/elasticsearch/get-petition-counts.js 2022

const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  computeDate,
  dateStringsCompared,
} = require('../../src/business/utilities/DateHandler');
const {
  searchAll,
} = require('../../src/persistence/elasticsearch/searchClient');
const { DateTime } = require('luxon');

const year = process.argv[2] || DateTime.now().toObject().year;

const getAllPetitions = async ({ applicationContext }) => {
  const { results } = await searchAll({
    applicationContext,
    searchParameters: {
      _source: ['createdAt.S', 'isPaper.BOOL'],
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
                    gte: computeDate({ day: 1, month: 1, year }),
                    lt: computeDate({ day: 1, month: 1, year: year + 1 }),
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

const getCounts = ({ gte, lte, petitions }) => {
  const petitionsReceivedInTimeframe = petitions.filter(
    p =>
      dateStringsCompared(p.createdAt, gte) >= 0 &&
      dateStringsCompared(p.createdAt, lte) < 0,
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

(async () => {
  const applicationContext = createApplicationContext({});
  const petitions = await getAllPetitions({ applicationContext });
  const start = DateTime.fromISO(`${year}-01-01`);

  for (let month = 0; month < 12; month++) {
    const [gte, lte] = [
      start.plus({ months: month }),
      start.plus({ months: month + 1 }),
    ];
    const { isElectronic, isPaper } = getCounts({
      gte: gte.toISO(),
      lte: lte.toISO(),
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
