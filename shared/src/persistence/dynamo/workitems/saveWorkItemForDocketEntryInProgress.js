const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { put } = require('../../dynamodbClientService');
/**
 * saveWorkItemForDocketEntryInProgress
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 * @returns {Promise} promise
 */
exports.saveWorkItemForDocketEntryInProgress = async ({
  applicationContext,
  workItem,
}) => {
  await put({
    Item: {
      ...workItem,
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `work-item|${workItem.workItemId}`,
      sk: `work-item|${workItem.workItemId}`,
    },
    applicationContext,
  });

  return Promise.all([
    createSectionInboxRecord({
      applicationContext,
      section: workItem.section,
      workItem,
    }),
    createUserInboxRecord({
      applicationContext,
      userId: workItem.assigneeId,
      workItem,
    }),
    put({
      Item: {
        pk: `case|${workItem.docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      },
      applicationContext,
    }),
  ]);
};
