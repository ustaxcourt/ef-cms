const { put } = require('../../dynamodbClientService');

/**
 * createUserOutboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user id to create the record for
 * @param {object} providers.workItem the work item data
 */
exports.createUserOutboxRecord = async ({
  applicationContext,
  userId,
  workItem,
}) => {
  await put({
    Item: {
      ...workItem,
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `user-outbox|${userId}`,
      sk: workItem.completedAt ? workItem.completedAt : workItem.updatedAt,
    },
    applicationContext,
  });
};
