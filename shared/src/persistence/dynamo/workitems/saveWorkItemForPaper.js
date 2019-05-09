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
  return Promise.all([
    put({
      Item: {
        pk: workItem.workItemId,
        sk: workItem.workItemId,
        ...workItem,
      },
      applicationContext,
    }),
    createMappingRecord({
      applicationContext,
      pkId: workItem.caseId,
      skId: workItem.workItemId,
      type: 'workItem',
    }),
    createMappingRecord({
      applicationContext,
      pkId: workItem.assigneeId,
      skId: workItem.workItemId,
      type: 'workItem',
    }),
    createMappingRecord({
      applicationContext,
      item: {
        messageId,
      },
      pkId: workItem.assigneeId,
      skId: messageId,
      type: 'unread-message',
    }),
    createMappingRecord({
      applicationContext,
      pkId: workItem.section,
      skId: workItem.workItemId,
      type: 'workItem',
    }),
  ]);
};
