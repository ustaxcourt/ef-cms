const { put } = require('../requests');

/**
 * forwardWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.forwardWorkItem = ({
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
