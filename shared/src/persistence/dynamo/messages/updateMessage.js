const { put } = require('../../dynamodbClientService');

/**
 * updateMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the created message
 */
exports.updateMessage = async ({ applicationContext, message }) => {
  return await put({
    Item: {
      gsi1pk: `message|${message.parentMessageId}`,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
      ...message,
    },
    applicationContext,
  });
};
