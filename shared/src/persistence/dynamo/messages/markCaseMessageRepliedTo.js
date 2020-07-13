const { update } = require('../../dynamodbClientService');

/**
 * markCaseMessageRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case containing the message
 * @param {string} providers.messageId the id of the message to update
 * @returns {object} the created case message
 */
exports.markCaseMessageRepliedTo = async ({
  applicationContext,
  caseId,
  messageId,
}) => {
  await update({
    ExpressionAttributeNames: {
      '#isRepliedTo': 'isRepliedTo',
    },
    ExpressionAttributeValues: {
      ':isRepliedTo': true,
    },
    Key: {
      pk: `case|${caseId}`,
      sk: `message|${messageId}`,
    },
    UpdateExpression: 'SET #isRepliedTo = :isRepliedTo',
    applicationContext,
  });
};
