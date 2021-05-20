const { put } = require('../../dynamodbClientService');

/**
 * createMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.message the message data
 * @returns {object} the created message
 */
exports.createMessage = async ({ applicationContext, message }) => {
  await put({
    Item: {
      ...message,
      gsi1pk: `message|${message.parentMessageId}`,
      pk: `case|${message.docketNumber}`,
      sk: `message|${message.messageId}`,
    },
    applicationContext,
  });
};
