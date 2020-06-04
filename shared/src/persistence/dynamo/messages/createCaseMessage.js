const { put } = require('../../dynamodbClientService');

/**
 * createCaseMessage
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseMessage the case message data
 * @returns {object} the created case message
 */
exports.createCaseMessage = async ({ applicationContext, caseMessage }) => {
  await put({
    Item: {
      pk: `case|${caseMessage.caseId}`,
      sk: `message|${caseMessage.messageId}`,
      ...caseMessage,
    },
    applicationContext,
  });

  await put({
    Item: {
      pk: `message|${caseMessage.messageId}`,
      sk: `message|${caseMessage.messageId}`,
      ...caseMessage,
    },
    applicationContext,
  });

  // create user inbox record
  await put({
    Item: {
      gsi1pk: `message|${caseMessage.messageId}`,
      pk: `user-inbox|${caseMessage.toUserId}`,
      sk: `message|${caseMessage.messageId}`,
      ...caseMessage,
    },
    applicationContext,
  });

  // create user outbox record
  await put({
    Item: {
      gsi1pk: `message|${caseMessage.messageId}`,
      pk: `user-outbox|${caseMessage.fromUserId}`,
      sk: caseMessage.createdAt,
      ...caseMessage,
    },
    applicationContext,
  });

  // create section inbox record
  await put({
    Item: {
      gsi1pk: `message|${caseMessage.messageId}`,
      pk: `section-inbox|${caseMessage.toSection}`,
      sk: `message|${caseMessage.messageId}`,
      ...caseMessage,
    },
    applicationContext,
  });

  // create section outbox record
  await put({
    Item: {
      gsi1pk: `message|${caseMessage.messageId}`,
      pk: `section-outbox|${caseMessage.fromSection}`,
      sk: caseMessage.createdAt,
      ...caseMessage,
    },
    applicationContext,
  });
};
