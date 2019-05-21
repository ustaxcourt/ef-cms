const { put } = require('../../dynamodbClientService');

/**
 * createSectionOutboxRecord
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createSectionOutboxRecord = async ({
  workItem,
  section,
  applicationContext,
}) => {
  await put({
    Item: {
      pk: `section-outbox-${section}`,
      sk: workItem.createdAt,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
