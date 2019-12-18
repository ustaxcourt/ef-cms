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
      gsi1pk: `workitem-${workItem.workItemId}`,
      pk: `section-${workItem.section}`,
      sk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
