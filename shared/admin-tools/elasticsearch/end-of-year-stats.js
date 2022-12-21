const createApplicationContext = require('../../../web-api/src/applicationContext');
const fs = require('fs');
const { computeDate } = require('../../src/business/utilities/DateHandler');
const { search } = require('../../src/persistence/elasticsearch/searchClient');

const fiscalYear = process.argv[3] || new Date().getFullYear();

const startOfYear = computeDate({ day: 1, month: 10, year: fiscalYear - 1 });
const endOfYear = computeDate({ day: 1, month: 10, year: fiscalYear });

const fiscalYearDateRange = {
  gte: startOfYear,
  lt: endOfYear,
};

const receivedAtRange = {
  range: {
    'receivedAt.S': fiscalYearDateRange,
  },
};

const suffixAggregation = {
  'by-suffix': {
    terms: {
      field: 'docketNumberSuffix.S',
    },
  },
  'no-suffix': {
    missing: {
      field: 'docketNumberSuffix.S',
    },
  },
};

const monthlyAggregation = {
  'by-month': {
    date_histogram: {
      calendar_interval: 'month',
      field: 'filingDate.S',
    },
  },
};

let suffixAndMonthlyAggregation = suffixAggregation;
suffixAndMonthlyAggregation['by-suffix']['aggs'] = monthlyAggregation;
suffixAndMonthlyAggregation['no-suffix']['aggs'] = monthlyAggregation;

const getOpinionsFiledByCaseType = async ({ applicationContext }) => {
  const result = await search({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                terms: {
                  'eventCode.S': ['MOP', 'OST', 'SOP', 'TCOP'],
                },
              },
              receivedAtRange,
            ],
          },
        },
      },
      index: 'efcms-docket-entry',
      size: 20000,
    },
  });
  let opinionsFiledByCaseType = {};
  for (const hit of result.results) {
    const docketNumberSuffix =
      (await determineDocketNumberSuffix({
        applicationContext,
        docketNumber: hit.docketNumber,
      })) || 'Regular';
    if (!(docketNumberSuffix in opinionsFiledByCaseType)) {
      opinionsFiledByCaseType[docketNumberSuffix] = 0;
    }
    opinionsFiledByCaseType[docketNumberSuffix]++;
  }
  const rows = [];
  for (const suffix in opinionsFiledByCaseType) {
    rows.push([suffix, opinionsFiledByCaseType[suffix]].join(','));
  }
  fs.writeFileSync(
    `./FY-${fiscalYear}-opinions-filed-by-case-type.csv`,
    rows.join('\n'),
  );
};

const getCasesOpenedAndClosed = async ({ applicationContext }) => {
  const { count: totalFiled } = await applicationContext
    .getSearchClient()
    .count({
      body: {
        query: receivedAtRange,
      },
      index: 'efcms-case',
    });

  const { count: totalClosed } = await applicationContext
    .getSearchClient()
    .count({
      body: {
        query: {
          range: {
            'closedDate.S': fiscalYearDateRange,
          },
        },
      },
      index: 'efcms-case',
    });

  const rows = [];
  rows.push(['Closed', totalClosed].join(','));
  rows.push(['Filed', totalFiled].join(','));
  fs.writeFileSync(
    `./FY-${fiscalYear}-cases-filed-and-closed.csv`,
    rows.join('\n'),
  );
};

const getCasesFiledByType = async ({ applicationContext }) => {
  const results = await applicationContext.getSearchClient().search({
    body: {
      aggs: suffixAggregation,
      query: receivedAtRange,
    },
    index: 'efcms-case',
  });

  const rows = results.aggregations['by-suffix'].buckets.map(
    ({ doc_count, key }) => [key, doc_count].join(','),
  );
  rows.push(['Regular', results.aggregations['no-suffix'].doc_count].join(','));
  rows.unshift(['Type', 'Count'].join(','));
  fs.writeFileSync(
    `./FY-${fiscalYear}-cases-filed-by-type.csv`,
    rows.join('\n'),
  );
};

const determineDocketNumberSuffix = async ({
  applicationContext,
  docketNumber,
}) => {
  const result = await search({
    applicationContext,
    searchParameters: {
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  'docketNumber.S': docketNumber,
                },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    },
  });
  return result.results[0].docketNumberSuffix;
};

const getTotalOpenCasesEOY = async ({ applicationContext }) => {
  const { count: currentOpenCount } = await applicationContext
    .getSearchClient()
    .count({
      body: {
        query: {
          bool: {
            must_not: {
              term: {
                'status.S': 'Closed',
              },
            },
          },
        },
      },
      index: 'efcms-case',
    });

  const { count: numberOpenedSinceEOY } = await applicationContext
    .getSearchClient()
    .count({
      body: {
        query: {
          range: {
            'receivedAt.S': {
              gte: endOfYear,
            },
          },
        },
      },
      index: 'efcms-case',
    });

  const { count: numberClosedSinceEOY } = await applicationContext
    .getSearchClient()
    .count({
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  'closedDate.S': {
                    gte: endOfYear,
                  },
                },
              },
              {
                range: {
                  'receivedAt.S': {
                    lt: endOfYear,
                  },
                },
              },
            ],
          },
        },
      },
      index: 'efcms-case',
    });

  const numberOfCasesOpenAtEOY =
    currentOpenCount - numberOpenedSinceEOY + numberClosedSinceEOY;

  const rows = [];
  rows.push(['Current Open Cases', currentOpenCount].join(','));
  rows.push(['Cases Opened since EOY', numberOpenedSinceEOY].join(','));
  rows.push(['Cases Closed since EOY', numberClosedSinceEOY].join(','));
  rows.push(['Total Cases Open at EOY', numberOfCasesOpenAtEOY].join(','));

  fs.writeFileSync(
    `./FY-${fiscalYear}-cases-open-at-end-of-fiscal-year.csv`,
    rows.join('\n'),
  );
};

(async () => {
  const applicationContext = createApplicationContext({});
  await getOpinionsFiledByCaseType({
    applicationContext,
  });
  await getCasesOpenedAndClosed({
    applicationContext,
  });
  await getCasesFiledByType({
    applicationContext,
  });
  await getTotalOpenCasesEOY({
    applicationContext,
  });
})();
