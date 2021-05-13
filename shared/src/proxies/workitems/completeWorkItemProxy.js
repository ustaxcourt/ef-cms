const { put } = require('../requests');

/**
 * completeWorkItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.completedMessage the message for completing the work item
 * @param {string} providers.workItemId the id of the work item to complete
 * @returns {Promise<*>} the promise of the api call
 */
exports.completeWorkItemInteractor = (
  applicationContext,
  { completedMessage, workItemId },
) => {
  return put({
    applicationContext,
    body: { completedMessage },
    endpoint: `/work-items/${workItemId}/complete`,
  });
};
