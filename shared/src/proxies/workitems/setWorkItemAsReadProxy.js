const { post } = require('../requests');

/**
 * setWorkItemAsRead
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.setWorkItemAsRead = ({ applicationContext, workItemId }) => {
  return post({
    applicationContext,
    endpoint: `/work-items/${workItemId}/read`,
  });
};
