const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createSectionOutboxRecord } = require('./createSectionOutboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { createUserOutboxRecord } = require('./createUserOutboxRecord');
const { get, put } = require('../../dynamodbClientService');

/**
 * createWorkItem
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 */
exports.createWorkItem = async ({ applicationContext, workItem }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const user = await get({
    Key: {
      pk: authorizedUser.userId,
      sk: authorizedUser.userId,
    },
    applicationContext,
  });

  await put({
    Item: {
      gsi1pk: `workitem-${workItem.workItemId}`,
      pk: `workitem-${workItem.workItemId}`,
      sk: `workitem-${workItem.workItemId}`,
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
