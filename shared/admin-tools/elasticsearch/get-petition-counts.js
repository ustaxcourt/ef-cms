const {
  computeDate,
  dateStringsCompared,
} = require('../../src/business/utilities/DateHandler');
const { DateTime } = require('luxon');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

let allPetitions = false;

const getAllItems = async () => {
  if (allPetitions) return allPetitions;
  const esClient = await getClient({ environmentName });
  const allItems = [];
  const responseQueue = [];

  const res = await esClient.search({
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
                  gte: computeDate({ day: 1, month: 1, year: 2021 }),
                  lte: computeDate({ day: 1, month: 1, year: 2022 }),
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    scroll: '60s',
    size: 5000,
  });

  responseQueue.push(res);
  while (responseQueue.length) {
    const body = responseQueue.shift();

    // collect the titles from this response
    body.hits.hits.forEach(function (hit) {
      allItems.push(hit['_source']);
    });

    // check to see if we have collected all of the quotes
    if (body.hits.total.value === allItems.length) {
      return allItems;
    }

    // get the next response if there are more quotes to fetch
    responseQueue.push(
      await esClient.scroll({
        scroll: '60s',
        scrollId: body['_scroll_id'],
      }),
    );
  }
};

const getPetitions = async ({ gte, lte }) => {
  const esClient = await getClient({ environmentName });
  const query = {
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
                  gte,
                  lte,
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  };
  const results = await esClient.search(query);
  // console.log(`Total: ${results.hits.total.value}`);
  return results.hits.hits;
};

const getCounts = async ({ gte, isPaper, lte, showCases = false }) => {
  if (isPaper) {
    const petitions = await getPetitions({ gte, lte });
    const paperPetitions = petitions.filter(
      p => p['_source']?.isPaper?.BOOL === isPaper,
    );

    if (showCases) {
      paperPetitions.forEach(p => {
        console.log({
          docketNumber: p['_source'].docketNumber,
          filedBy: p['_source'].filedBy,
          receivedAt: p['_source'].receivedAt,
        });
      });
    }

    return paperPetitions.length;
  } else {
    allPetitions = await getAllItems();
    // console.log(`allPetitions.length: ${allPetitions.length};`);
    allPetitions = allPetitions.filter(p => !p.isPaper?.BOOL);
    return allPetitions.filter(
      p =>
        dateStringsCompared(p.createdAt.S, gte) >= 0 &&
        dateStringsCompared(p.createdAt.S, lte) < 0,
    ).length;
  }
};

(async () => {
  const results = {};

  const start = DateTime.fromISO('2021-01-01');

  for (let month = 0; month < 12; month++) {
    const [gte, lte] = [
      start.plus({ months: month }),
      start.plus({ months: month + 1 }),
    ];
    const isElectronic = await getCounts({
      gte: gte.toISO(),
      isPaper: false,
      lte: lte.toISO(),
    });
    const isPaper = await getCounts({ gte, isPaper: true, lte });
    results[month] = {
      isElectronic,
      isPaper,
    };
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
