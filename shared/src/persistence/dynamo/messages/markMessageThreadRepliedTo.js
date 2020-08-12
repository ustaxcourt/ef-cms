const { getMessageThreadByParentId } = require('./getMessageThreadByParentId');
const { update } = require('../../dynamodbClientService');

/**
 * markMessageThreadRepliedTo
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to update
 * @returns {object} the created message
 */
exports.markMessageThreadRepliedTo = async ({
  applicationContext,
  parentMessageId,
}) => {
  const messages = await getMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  if (messages.length) {
    const updateMessage = async message => {
      return await update({
        ExpressionAttributeNames: {
          '#isRepliedTo': 'isRepliedTo',
        },
        ExpressionAttributeValues: {
          ':isRepliedTo': true,
        },
        Key: {
          pk: `case|${message.docketNumber}`,
          sk: `message|${message.messageId}`,
        },
        UpdateExpression: 'SET #isRepliedTo = :isRepliedTo',
        applicationContext,
      });
    };

    await Promise.all(messages.map(updateMessage));
  }
};
