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

const getOpinionsFiledInFiscalYear = async ({ applicationContext }) => {
  const result = await applicationContext.getSearchClient().search({
    body: {
      aggs: suffixAndMonthlyAggregation,
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
  });
  console.log(result);
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
