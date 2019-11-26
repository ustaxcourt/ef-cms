const AWS = require('aws-sdk');
const {
  aggregateCommonQueryParams,
} = require('../utilities/aggregateCommonQueryParams');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { get } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * caseAdvancedSearchInteractor
 *
 * @param {object} providers the providers object containing applicationContext, countryType, petitionerName, petitionerState, yearFiledMax, yearFiledMin
 * @returns {object} the case data
 */
exports.caseAdvancedSearchInteractor = async providers => {
  const { applicationContext } = providers;

  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADVANCED_SEARCH)) {
    throw new UnauthorizedError('Unauthorized');
  }

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

  return foundCases;
};
