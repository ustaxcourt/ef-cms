const {
  aggregateCommonQueryParams,
} = require('../../business/utilities/aggregateCommonQueryParams');
const {
  MAX_SEARCH_CLIENT_RESULTS,
} = require('../../business/entities/EntityConstants');
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
    'contactId',
    'docketNumber',
    'docketNumberSuffix',
    'docketNumberWithSuffix',
    'irsPractitioners',
    'partyType',
    'petitioners',
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

  ({ results } = await search({
    applicationContext,
    searchParameters: {
      body: {
        _source: sourceFields,
        min_score: 0.1,
        query,
        size: MAX_SEARCH_CLIENT_RESULTS,
      },
      index: 'efcms-case',
    },
  }));

  return results;
};
