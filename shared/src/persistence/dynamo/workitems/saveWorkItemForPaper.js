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
      pk: `work-item|${workItem.workItemId}`,
      sk: `work-item|${workItem.workItemId}`,
      ...workItem,
    },
    applicationContext,
  });
  await put({
    Item: {
      pk: `case|${workItem.caseId}`,
      sk: `work-item|${workItem.workItemId}`,
    },
    applicationContext,
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
