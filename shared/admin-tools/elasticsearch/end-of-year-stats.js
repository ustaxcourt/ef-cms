const createApplicationContext = require('../../../web-api/src/applicationContext');
const fs = require('fs');

const { computeDate } = require('../../src/business/utilities/DateHandler');

const fiscalYearDateRange = {
  gte: computeDate({ day: 1, month: 10, year: 2021 }),
  lte: computeDate({ day: 30, month: 9, year: 2022 }),
};

const receivedAtRange = {
  range: {
    'receivedAt.S': fiscalYearDateRange,
  },
};

/*
COUNT QUERY:
applicationContext.getSearchClient().count({
    body: {
      query: {
        bool: {
          must: [
            {
              terms: {
                'eventCode.S': ['MOP', 'OST', 'SOP', 'TCOP'],
              },
            },
            ...fiscalYearDateRange,
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
  });
 */

const getOpinionsFiledInFiscalYear = async ({ applicationContext }) => {
  const result = await applicationContext.getSearchClient().search({
    body: {
      aggs: {
        'no-suffix': {
          aggs: {
            'by-month': {
              date_histogram: {
                calendar_interval: 'month',
                field: 'filingDate.S',
              },
            },
          },
          missing: {
            field: 'docketNumberSuffix.S',
          },
        },
        'with-suffix': {},
      },
      index: 'efcms-docket-entry',
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
  });
  console.log(result.aggregations['by-month'].buckets);
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
  fs.writeFileSync('./cases-filed-and-closed.csv', rows.join('\n'));
};

const getCasesFiledByType = async ({ applicationContext }) => {
  const results = await applicationContext.getSearchClient().search({
    body: {
      aggs: {
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
      },
      query: receivedAtRange,
    },
    index: 'efcms-case',
  });

  const rows = results.aggregations['by-suffix'].buckets.map(
    ({ doc_count, key }) => [key, doc_count].join(','),
  );
  rows.push(['Regular', results.aggregations['no-suffix'].doc_count].join(','));
  rows.unshift(['Type', 'Count'].join(','));
  fs.writeFileSync('./cases-filed-by-type.csv', rows.join('\n'));
};

(async () => {
  const applicationContext = createApplicationContext({});
  await getOpinionsFiledInFiscalYear({
    applicationContext,
  });
  await getCasesOpenedAndClosed({
    applicationContext,
  });
  await getCasesFiledByType({
    applicationContext,
  });
})();
