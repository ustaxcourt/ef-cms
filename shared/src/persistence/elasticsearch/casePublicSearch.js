const {
  aggregateCommonQueryParams,
} = require('../../business/utilities/aggregateCommonQueryParams');
const {
  MAX_SEARCH_RESULTS,
} = require('../../business/entities/EntityConstants');
const { search } = require('./searchClient');

/**
 * casePublicSearch
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.casePublicSearchExactMatch = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  const { commonQuery, exactMatchesQuery } = aggregateCommonQueryParams({
    applicationContext,
    countryType,
    petitionerName,
    petitionerState,
    yearFiledMax,
    yearFiledMin,
  });

  const sourceFields = [
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
  const query = {
    bool: {
      must: [...exactMatchesQuery, ...commonQuery],
      must_not: {
        exists: {
          field: 'sealedDate',
        },
      },
    },
  };

  console.log(JSON.stringify(query, null, 2));

  ({ results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: sourceFields,
        min_score: 0.5,
        query,
        size: MAX_SEARCH_RESULTS,
      },
      index: 'efcms-case',
    },
  }));

  return results;
};

exports.casePublicSearchPartialMatch = async ({
  applicationContext,
  countryType,
  petitionerName,
  petitionerState,
  yearFiledMax,
  yearFiledMin,
}) => {
  // TO DO
  const { commonQuery, nonExactMatchesQuery } = aggregateCommonQueryParams({
    applicationContext,
    countryType,
    petitionerName,
    petitionerState,
    yearFiledMax,
    yearFiledMin,
  });

  const sourceFields = [
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
        _source: sourceFields,
        query: {
          bool: {
            must: [...nonExactMatchesQuery, ...commonQuery],
            must_not: {
              exists: {
                field: 'sealedDate',
              },
            },
          },
        },
        size: MAX_SEARCH_RESULTS,
      },
      index: 'efcms-case',
    },
  }));

  return results;
};
