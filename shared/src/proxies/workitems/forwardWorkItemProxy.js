const { put } = require('../requests');

/**
 * forwardWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.message the message to send to the user when assigning the work item
 * @param {string} providers.workItemId the id of the work item to assign
 * @returns {Promise<*>} the promise of the api call
 */
exports.forwardWorkItemInteractor = ({
  applicationContext,
  assigneeId,
  message,
  workItemId,
}) => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      message,
    },
    endpoint: `/work-items/${workItemId}/assignee`,
  });
};
