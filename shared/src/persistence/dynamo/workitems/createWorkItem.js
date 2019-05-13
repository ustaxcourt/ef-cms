const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { put } = require('../../dynamodbClientService');

/**
 * createWorkItem
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.createWorkItem = async ({
  messageId,
  workItem,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  await createMappingRecord({
    applicationContext,
    pkId: workItem.caseId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

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

  // sending user 'my' outbox
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItem.workItemId,
    },
    pkId: workItem.sentByUserId,
    skId: workItem.createdAt,
    type: 'outbox',
  });

  // section inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // sending user section outbox
  await createMappingRecord({
    applicationContext,
    item: {
      workItemId: workItem.workItemId,
    },
    pkId: user.section,
    skId: workItem.createdAt,
    type: 'outbox',
  });
};
