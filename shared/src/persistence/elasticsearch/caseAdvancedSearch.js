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

  let results;

  ({ results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: [
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
        ],
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
          _source: [
            'caseCaption',
            'contactPrimary',
            'contactSecondary',
            'docketNumber',
            'docketNumberSuffix',
            'receivedAt',
            'sealedDate',
          ],
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
