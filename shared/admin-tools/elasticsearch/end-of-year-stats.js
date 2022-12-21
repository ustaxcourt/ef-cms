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

const getOpinionsFiledByCaseType = async ({ applicationContext }) => {
  const results = await search({
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
  for (const hit of results.results) {
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

  console.log({ currentOpenCount });

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

  console.log({ numberOpenedSinceEOY });
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

  console.log({ numberClosedSinceEOY });

  const numberOfCasesOpenAtEOY =
    currentOpenCount - numberOpenedSinceEOY + numberClosedSinceEOY;

  console.log({
    numberOfCasesOpenAtEOY,
  });
};

const getPercentageOfCasesInWhichPetitionerIsRepresented = async ({applicationContext}) => {
  const results = await applicationContext.getSearchClient().search({
    body: {
      aggs: {
        'pro-se': {
          missing: {
            field: 'privatePractitioners.L.M.userId.S',
          },
        },
        represented: {
          filter: {
            exists: {
              field: 'privatePractitioners.L.M.userId.S',
            },
          },
        },
      },
      query: receivedAtRange,
    },
    index: 'efcms-case',
  });

  const proSeCount = results.aggregations['pro-se'].doc_count;
  const representedCount = results.aggregations.represented.doc_count;
  const rows = [];
  rows.push(['Type', 'Count'].join(','));
  rows.push(['Pro Se', proSeCount].join(','));
  rows.push(['Represented', representedCount].join(','));
  fs.writeFileSync(
    `./FY-${fiscalYear}-cases-by-representation.csv`,
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
  await getPercentageOfCasesInWhichPetitionerIsRepresented({
    applicationContext,
  });
})();
