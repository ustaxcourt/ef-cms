const { createMappingRecord } = require('../helpers/createMappingRecord');
const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
const { put } = require('../../dynamodbClientService');
/**
 * saveWorkItemForNonPaper
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.saveWorkItemForDocketClerkFilingExternalDocument = async ({
  workItem,
  applicationContext,
}) => {
  await put({
    Item: {
      pk: `workitem-${workItem.workItemId}`,
      sk: `workitem-${workItem.workItemId}`,
      gsi1pk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });

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

  await createMappingRecord({
    applicationContext,
    pkId: workItem.caseId,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
