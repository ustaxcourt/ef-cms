const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { put } = require('../../dynamodbClientService');
/**
 * saveWorkItemForNonPaper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.saveWorkItemForNonPaper = async ({ applicationContext, workItem }) => {
  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `work-item|${workItem.workItemId}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });

  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });

  await put({
    Item: {
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
    },
    applicationContext,
  });
};
