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
exports.saveWorkItemForPaper = async ({
  messageId,
  workItem,
  applicationContext,
}) => {
  // create the work item
  await put({
    Item: {
      pk: workItem.workItemId,
      sk: workItem.workItemId,
      ...workItem,
    },
    applicationContext,
  });

  await createMappingRecord({
    applicationContext,
    pkId: workItem.caseId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // individual inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.assigneeId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  await createMappingRecord({
    applicationContext,
    item: {
      messageId,
    },
    pkId: workItem.assigneeId,
    skId: messageId,
    type: 'unread-message',
  });

  // section inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
