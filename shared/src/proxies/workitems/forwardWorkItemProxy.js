const { put } = require('../requests');

/**
 * forwardWorkItemInteractor
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
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
