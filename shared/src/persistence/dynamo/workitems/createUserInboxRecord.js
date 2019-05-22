const { put } = require('../../dynamodbClientService');

/**
 * createUserInboxRecord
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createUserInboxRecord = async ({ workItem, applicationContext }) => {
  await put({
    Item: {
      pk: `user-${workItem.assigneeId}`,
      sk: `workitem-${workItem.workItemId}`,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
