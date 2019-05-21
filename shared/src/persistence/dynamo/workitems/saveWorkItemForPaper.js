const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');
const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
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
