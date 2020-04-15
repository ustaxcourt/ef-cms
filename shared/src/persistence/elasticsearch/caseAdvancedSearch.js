const {
  aggregateCommonQueryParams,
} = require('../utilities/aggregateCommonQueryParams');
const { isEmpty } = require('lodash');
const { search } = require('./searchClient');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.caseAdvancedSearch = async providers => {
  const { applicationContext } = providers;

  const {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  } = aggregateCommonQueryParams(providers);

  let foundCases = (
    await search({
      applicationContext,
      searchParameters: {
        body: {
          _source: [
            'caseCaption',
            'contactPrimary',
            'contactSecondary',
            'docketNumber',
            'docketNumberSuffix',
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
        index: 'efcms',
      },
    })
  ).results;

  if (isEmpty(foundCases)) {
    foundCases = (
      await search({
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
          index: 'efcms',
        },
      })
    ).results;
  }

  return foundCases;
};
