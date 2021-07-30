const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
const { put } = require('../../dynamodbClientService');
/**
 * saveWorkItemForDocketClerkFilingExternalDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.saveWorkItemForDocketClerkFilingExternalDocument = async ({
  applicationContext,
  workItem,
}) => {
  await createSectionOutboxRecord({
    applicationContext,
    section: workItem.section,
    workItem,
  });

  await createUserOutboxRecord({
    applicationContext,
    userId: workItem.assigneeId,
    workItem,
  });

  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `case|${workItem.docketNumber}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
};
