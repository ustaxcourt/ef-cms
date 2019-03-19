const { put } = require('../requests');

/**
 * completeWorkItem
 *
 * @param completedMessage
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.completeWorkItem = ({
  completedMessage,
  workItemId,
  applicationContext,
}) => {
  return put({
    applicationContext,
    body: { completedMessage },
    endpoint: `/workitems/${workItemId}/complete`,
  });
};
