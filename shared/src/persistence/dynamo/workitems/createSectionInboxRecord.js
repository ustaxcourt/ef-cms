const { put } = require('../../dynamodbClientService');

/**
 * createSectionInboxRecord
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.createSectionInboxRecord = async ({ applicationContext, workItem }) => {
  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `section|${workItem.section}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
