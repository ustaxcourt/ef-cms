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
  return Promise.all([
    put({
      Item: {
        pk: `workitem-${workItem.workItemId}`,
        sk: `workitem-${workItem.workItemId}`,
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
    createUserInboxRecord({
      applicationContext,
      workItem,
    }),
    createSectionInboxRecord({
      applicationContext,
      workItem,
    }),
  ]);
};
