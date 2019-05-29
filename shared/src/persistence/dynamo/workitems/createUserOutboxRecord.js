const { put } = require('../../dynamodbClientService');

/**
 * createUserrOutboxRecord
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createUserOutboxRecord = async ({
  userId,
  workItem,
  applicationContext,
}) => {
  await put({
    Item: {
      pk: `user-outbox-${userId}`,
      sk: workItem.createdAt,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
