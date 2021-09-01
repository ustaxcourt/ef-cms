const client = require('../../dynamodbClientService');

/**
 * getIndexedCasesForUser
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the userId to filter cases by
 * @returns {object} the case data
 */
exports.getIndexedCasesForUser = ({ applicationContext, userId }) =>
  client.queryFull({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'case',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
