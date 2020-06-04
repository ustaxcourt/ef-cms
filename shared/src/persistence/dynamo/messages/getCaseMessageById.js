const { query } = require('../../dynamodbClientService');

/**
 * getCaseMessageById
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the message id
 * @returns {object} the created case message
 */
exports.getCaseMessageById = async ({ applicationContext, messageId }) => {
  const messages = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `messsage|${messageId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return messages[0];
};
