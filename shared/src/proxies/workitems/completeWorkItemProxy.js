const { put } = require('../requests');

/**
 * completeWorkItemInteractor
 *
 * @param completedMessage
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.completeWorkItemInteractor = ({
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
