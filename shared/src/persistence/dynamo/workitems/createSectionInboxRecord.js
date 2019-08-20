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
      pk: `section-${workItem.section}`,
      sk: `workitem-${workItem.workItemId}`,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
