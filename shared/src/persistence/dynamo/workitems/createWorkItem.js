const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
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
exports.createWorkItem = async ({ applicationContext, workItem }) => {
  const user = applicationContext.getCurrentUser();

  await put({
    Item: {
      pk: `workitem-${workItem.workItemId}`,
      sk: `workitem-${workItem.workItemId}`,
      gsi1pk: `workitem-${workItem.workItemId}`,
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

  await createUserInboxRecord({
    applicationContext,
    workItem,
  });

  await createUserOutboxRecord({
    applicationContext,
    userId: user.userId,
    workItem,
  });

  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });

  await createSectionOutboxRecord({
    applicationContext,
    section: user.section,
    workItem,
  });
};
