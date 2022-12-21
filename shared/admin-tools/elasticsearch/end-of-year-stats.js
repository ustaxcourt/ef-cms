const createApplicationContext = require('../../../web-api/src/applicationContext');
const {
  searchAll,
} = require('../../src/persistence/elasticsearch/searchClient');
const { computeDate } = require('../../src/business/utilities/DateHandler');

const fiscalYearDateRange = {
  range: {
    'receivedAt.S': {
      gte: computeDate({ day: 1, month: 10, year: 2021 }),
      lte: computeDate({ day: 30, month: 9, year: 2022 }),
    },
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

const getOpinionsFiledInFiscalYear = ({ applicationContext }) => {
  return searchAll({
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
              fiscalYearDateRange,
            ],
          },
        },
      },
      index: 'efcms-docket-entry',
    },
  });
};

(async () => {
  const applicationContext = createApplicationContext({});
  const opinions = await getOpinionsFiledInFiscalYear({
    applicationContext,
  });
  console.log(opinions);
})();
