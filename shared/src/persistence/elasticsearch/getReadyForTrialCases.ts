const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

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
                has_parent: {
                  inner_hits: {
                    _source: {
                      includes: ['caseCaption', 'docketNumber', 'status'],
                    },
                    name: 'case-mappings',
                  },
                  parent_type: 'case',
                  query: {
                    bool: {
                      must: [
                        {
                          term: {
                            'status.S': CASE_STATUS_TYPES.generalDocket,
                          },
                        },
                      ],
                    },
                  },
                  score: true,
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
