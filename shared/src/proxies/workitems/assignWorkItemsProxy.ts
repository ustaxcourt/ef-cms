const { put } = require('../requests');

/**
 * getWorkItem
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.assigneeName the name of the user to assign the work item to
 * @param {string} providers.workItemId the id of the work item to assign
 * @returns {Promise<*>} the promise of the api call
 */
exports.assignWorkItemsInteractor = (
  applicationContext,
  { assigneeId, assigneeName, workItemId },
) => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      assigneeName,
      workItemId,
    },
    endpoint: '/work-items',
  });
};
