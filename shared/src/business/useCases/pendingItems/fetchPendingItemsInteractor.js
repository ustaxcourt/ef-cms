const AWS = require('aws-sdk');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { get } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * fetchPendingItemsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @returns {object} the case data
 */
exports.fetchPendingItemsInteractor = async ({ applicationContext, judge }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchParameters = {
    body: {
      _source: [
        'associatedJudge',
        'documents',
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'status',
      ],
      query: {
        bool: {
          must: [{ match: { 'blocked.BOOL': true } }],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  };

  if (judge) {
    searchParameters.body['_source'].push(['associatedJudge']);
    searchParameters.body.query.bool.must.push({
      match: { 'associatedJudge.S': judge },
    });
  }

  const body = await applicationContext
    .getSearchClient()
    .search(searchParameters);

  const foundCases = [];
  const hits = get(body, 'hits.hits');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  const foundDocuments = [];

  foundCases.forEach(foundCase => {
    const { documents, ...mappedProps } = foundCase;

    foundDocuments.push({
      ...mappedProps,
      ...documents[0],
    });
  });

  return foundDocuments;
};
