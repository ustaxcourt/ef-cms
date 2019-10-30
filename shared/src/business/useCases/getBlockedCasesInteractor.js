const AWS = require('aws-sdk');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { get } = require('lodash');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getBlockedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
exports.getBlockedCasesInteractor = async ({
  applicationContext,
  trialLocation,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const body = await applicationContext.getSearchClient().search({
    body: {
      _source: [
        'blocked',
        'blockedDate',
        'blockedReason',
        'caseCaption',
        'docketNumber',
        'docketNumberSuffix',
        'status',
      ],
      query: {
        bool: {
          must: [
            { match: { 'blocked.BOOL': true } },
            { match: { 'preferredTrialCity.S': trialLocation } },
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  });

  const foundCases = [];
  const hits = get(body, 'hits.hits');

  if (hits && hits.length > 0) {
    hits.forEach(hit => {
      foundCases.push(AWS.DynamoDB.Converter.unmarshall(hit['_source']));
    });
  }

  return foundCases;
};
