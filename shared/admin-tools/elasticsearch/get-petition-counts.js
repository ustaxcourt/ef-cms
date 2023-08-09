// usage: npx ts-node --transpile-only shared/admin-tools/elasticsearch/get-petition-counts.js 2022

const {
  createApplicationContext,
} = require('../../../web-api/src/applicationContext');
const {
  dateStringsCompared,
  validateDateAndCreateISO,
} = require('../../src/business/utilities/DateHandler');
const {
  searchAll,
} = require('../../../web-api/src/persistence/elasticsearch/searchClient');
const { DateTime } = require('luxon');

const year = process.argv[2] || DateTime.now().toObject().year;

const getAllPetitions = async ({ applicationContext }) => {
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
                    gte: validateDateAndCreateISO({ day: 1, month: 1, year }),
                    lt: validateDateAndCreateISO({
                      day: 1,
                      month: 1,
                      year: year + 1,
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

const getCounts = ({ gte, lt, petitions }) => {
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
      gte: gte.toISO(),
      lt: lt.toISO(),
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
