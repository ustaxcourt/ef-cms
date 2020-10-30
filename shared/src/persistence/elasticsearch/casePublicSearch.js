const {
  aggregateCommonQueryParams,
} = require('../../business/utilities/aggregateCommonQueryParams');
const {
  MAX_SEARCH_RESULTS,
} = require('../../business/entities/EntityConstants');
const { isEmpty } = require('lodash');
const { search } = require('./searchClient');
/**
 * casePublicSearch
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.casePublicSearch = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  const {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  } = aggregateCommonQueryParams({
    applicationContext,
    countryType,
    petitionerName,
    petitionerState,
    yearFiledMax,
    yearFiledMin,
  });

  const source = [
    'caseCaption',
    'contactPrimary',
    'contactSecondary',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'partyType',
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
        size: MAX_SEARCH_RESULTS,
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
          size: MAX_SEARCH_RESULTS,
        },
        index: 'efcms-case',
      },
    }));
  }

  return results;
};
