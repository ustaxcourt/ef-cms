const { put } = require('../../dynamodbClientService');

/**
 * createSectionInboxRecord
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createSectionInboxRecord = async ({ workItem, applicationContext }) => {
  await put({
    Item: {
      pk: `section-${workItem.section}`,
      sk: `workitem-${workItem.workItemId}`,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
