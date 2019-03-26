const { put } = require('../requests');

/**
 *
 * @param applicationContext
 * @param workItemToUpdate
 * @param workItemId
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateWorkItem = ({
  applicationContext,
  workItemToUpdate,
  workItemId,
}) => {
  return put({
    applicationContext,
    body: workItemToUpdate,
    endpoint: `/workitems/${workItemId}`,
  });
};
