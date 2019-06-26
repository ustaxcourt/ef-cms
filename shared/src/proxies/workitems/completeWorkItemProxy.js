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
  applicationContext,
  completedMessage,
  workItemId,
}) => {
  return put({
    applicationContext,
    body: { completedMessage },
    endpoint: `/work-items/${workItemId}/complete`,
  });
};
