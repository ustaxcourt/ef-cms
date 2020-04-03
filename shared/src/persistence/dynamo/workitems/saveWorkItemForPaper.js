const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { put } = require('../../dynamodbClientService');

/**
 * saveWorkItemForPaper
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 * @returns {Promise} the promise for the call to persistence
 */
exports.saveWorkItemForPaper = async ({ applicationContext, workItem }) => {
  // Warning - do not use Promise.all() as it seems to cause intermittent failures
  await put({
    Item: {
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

  await createSectionInboxRecord({
    applicationContext,
    workItem,
  });
};
