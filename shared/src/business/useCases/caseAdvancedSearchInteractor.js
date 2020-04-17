const AWS = require('aws-sdk');
const {
  aggregateCommonQueryParams,
} = require('../utilities/aggregateCommonQueryParams');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { caseSearchFilter } = require('../utilities/caseFilter');
const { get, isEmpty } = require('lodash');
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
  });

  let foundCases = [];
  const exactMatchesHits = get(exactMatchesBody, 'hits.hits');
  const unmarshallHit = hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']);

  if (!isEmpty(exactMatchesHits)) {
    foundCases = exactMatchesHits.map(unmarshallHit);
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
            'sealedDate',
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

    if (!isEmpty(nonExactMatchesHits)) {
      foundCases = nonExactMatchesHits.map(unmarshallHit);
    }
  }

  foundCases = caseSearchFilter(foundCases, authorizedUser);

  return foundCases;
};
