const { createMappingRecord } = require('../helpers/createMappingRecord');
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
      gsi1pk: `workitem-${workItem.workItemId}`,
      pk: `workitem-${workItem.workItemId}`,
      sk: `workitem-${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });

  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });

  await createMappingRecord({
    applicationContext,
    pkId: workItem.caseId,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
