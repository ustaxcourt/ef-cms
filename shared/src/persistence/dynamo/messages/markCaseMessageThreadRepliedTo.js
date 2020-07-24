const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
const {
  getCaseMessageThreadByParentId,
} = require('./getCaseMessageThreadByParentId');
const { update } = require('../../dynamodbClientService');

/**
 * markCaseMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to update
 * @returns {object} the created case message
 */
exports.markCaseMessageThreadRepliedTo = async ({
  applicationContext,
  parentMessageId,
}) => {
  const messages = await getCaseMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  if (messages.length) {
    const caseId = await getCaseIdFromDocketNumber({
      applicationContext,
      docketNumber: messages[0].docketNumber,
    });

    const updateMessage = async message => {
      return await update({
        ExpressionAttributeNames: {
          '#isRepliedTo': 'isRepliedTo',
        },
        ExpressionAttributeValues: {
          ':isRepliedTo': true,
        },
        Key: {
          pk: `case|${caseId}`,
          sk: `message|${message.messageId}`,
        },
        UpdateExpression: 'SET #isRepliedTo = :isRepliedTo',
        applicationContext,
      });
    };

    await Promise.all(messages.map(updateMessage));
  }
};
