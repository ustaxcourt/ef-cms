const { createMappingRecord } = require('../helpers/createMappingRecord');
const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
const { put } = require('../../dynamodbClientService');
/**
 * saveWorkItemForNonPaper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.saveWorkItemForDocketClerkFilingExternalDocument = async ({
  applicationContext,
  workItem,
}) => {
  await put({
    Item: {
      gsi1pk: `workitem-${workItem.workItemId}`,
      pk: `workitem-${workItem.workItemId}`,
      sk: `workitem-${workItem.workItemId}`,
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
