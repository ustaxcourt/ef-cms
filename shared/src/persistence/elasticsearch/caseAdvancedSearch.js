const {
  aggregateCommonQueryParams,
} = require('../../business/utilities/aggregateCommonQueryParams');
const { isEmpty } = require('lodash');
const { search } = require('./searchClient');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.caseAdvancedSearch = async ({ applicationContext, searchTerms }) => {
  const {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  } = aggregateCommonQueryParams({ applicationContext, ...searchTerms });

  const source = [
    'caseCaption',
    'contactPrimary',
    'contactSecondary',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'privatePractitioners',
    'receivedAt',
    'sealedDate',
  ];

  let results;

  ({ results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: source,
        query: {
          bool: {
            must: [...exactMatchesQuery, ...commonQuery],
          },
        },
        size: 5000,
      },
      index: 'efcms-case',
    },
  }));

  if (isEmpty(results)) {
    ({ results } = await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: source,
          query: {
            bool: {
              must: [...nonExactMatchesQuery, ...commonQuery],
            },
          },
        },
        index: 'efcms-case',
      },
    }));
  }

  return results;
};
