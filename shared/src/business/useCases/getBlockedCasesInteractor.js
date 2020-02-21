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
        'automaticBlocked',
        'automaticBlockedDate',
        'automaticBlockedReason',
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
            { match: { 'preferredTrialCity.S': trialLocation } },
            {
              bool: {
                should: [
                  { match: { 'automaticBlocked.BOOL': true } },
                  { match: { 'blocked.BOOL': true } },
                ],
              },
            },
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms',
  });

  const hits = get(body, 'hits.hits', []);
  const foundCases = hits.map(hit =>
    AWS.DynamoDB.Converter.unmarshall(hit['_source']),
  );

  return foundCases;
};
