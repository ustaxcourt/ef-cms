const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { put } = require('../../dynamodbClientService');

/**
 * saveWorkItemForPaper
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.saveWorkItemForPaper = async ({ workItem, applicationContext }) => {
  // create the work item
  await put({
    Item: {
      pk: workItem.workItemId,
      sk: workItem.workItemId,
      ...workItem,
    },
    applicationContext,
  });

  // individual inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.assigneeId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // section inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
