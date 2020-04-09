const { put } = require('../../dynamodbClientService');

/**
 * createUserInboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.createUserInboxRecord = async ({ applicationContext, workItem }) => {
  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `user|${workItem.assigneeId}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
