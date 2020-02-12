const AWS = require('aws-sdk');
const {
  aggregateCommonQueryParams,
} = require('../../utilities/aggregateCommonQueryParams');
const { get } = require('lodash');
const { PublicCase } = require('../../entities/cases/PublicCase');

/**
 * casePublicSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.casePublicSearchInteractor = async providers => {
  const { applicationContext } = providers;
  const {
    commonQuery,
    exactMatchesQuery,
    nonExactMatchesQuery,
  } = aggregateCommonQueryParams(providers);

  const exactMatchesBody = await applicationContext.getSearchClient().search({
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
          must: [...exactMatchesQuery, ...commonQuery],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  });

  const foundCases = [];
  const exactMatchesHits = get(exactMatchesBody, 'hits.hits');

  if (exactMatchesHits && exactMatchesHits.length > 0) {
    for (let hit of exactMatchesBody.hits.hits) {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    }
  } else {
    const nonExactMatchesBody = await applicationContext
      .getSearchClient()
      .search({
        body: {
          _source: [
            'caseCaption',
            'contactPrimary',
            'contactSecondary',
            'docketNumber',
            'docketNumberSuffix',
            'receivedAt',
          ],
          query: {
            bool: {
              must: [...nonExactMatchesQuery, ...commonQuery],
            },
          },
        },
        index: 'efcms',
      });

    const nonExactMatchesHits = get(nonExactMatchesBody, 'hits.hits');

    if (nonExactMatchesHits && nonExactMatchesHits.length > 0) {
      for (let hit of nonExactMatchesBody.hits.hits) {
        foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
      }
    }
  }

  const filteredCases = foundCases.filter(item => {
    return !item.sealedDate && item.docketNumber && item.caseCaption;
  });

  const makeSafe = item =>
    new PublicCase(item, { applicationContext }).validate().toRawObject();

  return filteredCases.map(makeSafe);
};
