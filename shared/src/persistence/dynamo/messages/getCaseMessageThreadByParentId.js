const { query } = require('../../dynamodbClientService');

/**
 * getCaseMessageThreadByParentId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.parentMessageId the id of the parent message
 * @returns {object} the created case message
 */
exports.getCaseMessageThreadByParentId = async ({
  applicationContext,
  parentMessageId,
}) => {
  return await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `message|${parentMessageId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });
};
