const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');
const simpleQueryFlags = 'OR|AND|ESCAPE|PHRASE'; // OR|AND|NOT|PHRASE|ESCAPE|PRECEDENCE', // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-simple-query-string-query.html#supported-flags

/**
 * getReadyForTrialCases
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the cases that are ready for trial
 */
exports.getReadyForTrialCases = async ({ applicationContext }) => {
  const { results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: ['docketNumber'],
        query: {
          bool: {
            filter: [
              {
                term: {
                  'entityName.S': 'DocketEntry',
                },
              },
            ],
            must: [
              {
                term: {
                  'documentType.S': 'Answer',
                },
              },
              {
                range: {
                  'createdAt.S': {
                    // Getting one extra day just so we don't miss any.
                    // Case.prototype.checkForReadyForTrial will continue to do the math as it always has.
                    lte: 'now-44d/d',
                  },
                },
              },
              {
                simple_query_string: {
                  default_operator: 'and',
                  fields: ['status.S'],
                  flags: simpleQueryFlags,
                  query: CASE_STATUS_TYPES.generalDocket,
                },
              },
            ],
            must_not: [
              {
                term: {
                  'isStricken.BOOL': true,
                },
              },
            ],
          },
        },
        size: 5000,
      },
      index: 'efcms-docket-entry',
    },
  });

  return results;
};
