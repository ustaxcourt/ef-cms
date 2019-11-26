const AWS = require('aws-sdk');
const {
  aggregateCommonQueryParams,
} = require('../utilities/aggregateCommonQueryParams');
const { get } = require('lodash');

/**
 * casePublicSearchInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.countryType the country type to search cases by (domestic/international)
 * @param {string} providers.petitionerName the name of the petitioner to search cases by
 * @param {string} providers.petitionerState the state of the petitioner to search cases by
 * @param {string} providers.yearFiledMax the max year filed to search cases by
 * @param {string} providers.yearFiledMin the min year filed to search cases by
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

  // TODO - Make response public-safe?
  return foundCases;
};
