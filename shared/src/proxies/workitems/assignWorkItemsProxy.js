const { put } = require('../requests');

/**
 * getWorkItem
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = ({
  workItemId,
  assigneeId,
  assigneeName,
  applicationContext,
}) => {
  return put({
    applicationContext,
    body: {
      assigneeId,
      assigneeName,
      workItemId,
    },
    endpoint: '/workitems',
  });
};
