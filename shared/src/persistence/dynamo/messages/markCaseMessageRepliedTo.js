const { update } = require('../../dynamodbClientService');

/**
 * markCaseMessageRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseMessage the case message data
 * @returns {object} the created case message
 */
exports.markCaseMessageRepliedTo = async ({
  applicationContext,
  caseId,
  messageId,
}) => {
  await update({
    ExpressionAttributeNames: {
      '#repliedTo': 'repliedTo',
    },
    ExpressionAttributeValues: {
      ':repliedTo': true,
    },
    Key: {
      pk: `case|${caseId}`,
      sk: `message|${messageId}`,
    },
    UpdateExpression: 'SET #repliedTo = :repliedTo',
    applicationContext,
  });
};
