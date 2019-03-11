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
  workItemId,
  assigneeId,
  message,
  applicationContext,
}) => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      message,
    },
    endpoint: `/workitems/${workItemId}/assignee`,
  });
};
