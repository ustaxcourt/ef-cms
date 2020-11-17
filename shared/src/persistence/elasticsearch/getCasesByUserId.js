const {
  calculateISODate,
  createISODateString,
} = require('../../business/utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * getCasesByUserId
 *
 * @param {object} providers the providers object containing applicationContext
 * @param {string} providers.applicationContext application context
 * @param {string} providers.userId user id
 * @returns {array} array of docket numbers
 */
exports.getCasesByUserId = async ({ applicationContext, userId }) => {
  const source = ['docketNumber'];

  const currentDate = createISODateString();
  const maxClosedDate = calculateISODate({
    dateString: currentDate,
    howMuch: -6,
    units: 'months',
  });

  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            minimum_should_match: 1,
            should: [
              {
                bool: {
                  must: [
                    { match: { 'pk.S': 'case|' } },
                    { match: { 'sk.S': 'case|' } },
                    {
                      query_string: {
                        fields: [
                          'privatePractitioners.L.M.userId.S',
                          'irsPractitioners.L.M.userId.S',
                          'userId.S',
                        ],
                        query: `"${userId}"`,
                      },
                    },
                    { match: { 'status.S': CASE_STATUS_TYPES.closed } },
                    {
                      range: {
                        'closedDate.S': {
                          format: 'strict_date_time',
                          gte: maxClosedDate,
                        },
                      },
                    },
                  ],
                },
              },
              {
                bool: {
                  must: [
                    { match: { 'pk.S': 'case|' } },
                    { match: { 'sk.S': 'case|' } },
                    {
                      query_string: {
                        fields: [
                          'privatePractitioners.L.M.userId.S',
                          'irsPractitioners.L.M.userId.S',
                          'userId.S',
                        ],
                        query: `"${userId}"`,
                      },
                    },
                  ],
                  must_not: {
                    match: { 'status.S': CASE_STATUS_TYPES.closed },
                  },
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  });

  return results;
};
