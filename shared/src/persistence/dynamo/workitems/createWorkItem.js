const {
  getCaseIdFromDocketNumber,
} = require('../cases/getCaseIdFromDocketNumber');
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

  const caseId = await getCaseIdFromDocketNumber({
    applicationContext,
    docketNumber: workItem.docketNumber,
  });

  const user = await get({
    Key: {
      pk: `user|${authorizedUser.userId}`,
      sk: `user|${authorizedUser.userId}`,
    },
    applicationContext,
  });

  await put({
    Item: {
      gsi1pk: `work-item|${workItem.workItemId}`,
      pk: `work-item|${workItem.workItemId}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });

  await put({
    Item: {
      pk: `case|${caseId}`,
      sk: `work-item|${workItem.workItemId}`,
    },
    applicationContext,
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
