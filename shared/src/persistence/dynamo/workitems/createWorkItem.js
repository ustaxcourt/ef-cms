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
  const user = applicationContext.getCurrentUser();

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
    pkId: workItem.assigneeId,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // sending user 'my' outbox
  await put({
    applicationContext,
    Item: {
      pk: `${workItem.sentByUserId}|outbox`,
      sk: workItem.createdAt,
      ...workItem,
    },
  });

  // section inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });

  // sending user section outbox
  await put({
    applicationContext,
    Item: {
      pk: `${user.section}|outbox`,
      sk: workItem.createdAt,
      ...workItem,
    },
  });
};
