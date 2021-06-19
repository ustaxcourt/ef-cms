const { createSectionInboxRecord } = require('./createSectionInboxRecord');
const { createUserInboxRecord } = require('./createUserInboxRecord');
const { put } = require('../../dynamodbClientService');

/**
 * saveWorkItemAndAddToUserAndSectionInbox
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.workItem the work item data
 * @returns {Promise} the promise for the call to persistence
 */
exports.saveWorkItemAndAddToUserAndSectionInbox = async ({
  applicationContext,
  workItem,
}) => {
  await Promise.all([
    put({
      Item: {
        ...workItem,
        gsi1pk: `work-item|${workItem.workItemId}`,
        pk: `work-item|${workItem.workItemId}`,
        sk: `work-item|${workItem.workItemId}`,
      },
      applicationContext,
    }),
    put({
      Item: {
        pk: `case|${workItem.docketNumber}`,
        sk: `work-item|${workItem.workItemId}`,
      },
      applicationContext,
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
