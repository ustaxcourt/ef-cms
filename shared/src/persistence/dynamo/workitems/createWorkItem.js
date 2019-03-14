const { put } = require('../../dynamodbClientService');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

/**
 * createWorkItem
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createWorkItem = async ({ workItem, applicationContext }) => {
  // create the work item
  await put({
    applicationContext,
    Item: {
      pk: workItem.workItemId,
      sk: workItem.workItemId,
      ...workItem,
    },
  });

  // individual inbox
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItem.workItemId,
    },
    pkId: workItem.assigneeId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // individual sent box
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItem.workItemId,
    },
    pkId: workItem.sentByUserId,
    skId: workItem.createdAt,
    type: 'sentWorkItem',
  });

  // section sent box
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItem.workItemId,
    },
    pkId: workItem.section,
    skId: workItem.createdAt,
    type: 'sentWorkItem',
  });
};
