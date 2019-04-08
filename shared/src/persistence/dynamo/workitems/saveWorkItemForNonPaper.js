const { createMappingRecord } = require('../helpers/createMappingRecord');
const { put } = require('../../dynamodbClientService');

/**
 * saveWorkItemForNonPaper
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.saveWorkItemForNonPaper = async ({ workItem, applicationContext }) => {
  // create the work item
  await put({
    Item: {
      pk: workItem.workItemId,
      sk: workItem.workItemId,
      ...workItem,
    },
    applicationContext,
  });

  // section inbox
  await createMappingRecord({
    applicationContext,
    pkId: workItem.section,
    skId: workItem.workItemId,
    type: 'workItem',
  });
};
