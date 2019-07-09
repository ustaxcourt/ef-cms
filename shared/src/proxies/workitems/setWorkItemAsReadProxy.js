const { post } = require('../requests');

/**
 * setWorkItemAsReadInteractor
 *
 * @param documents
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.setWorkItemAsReadInteractor = ({ applicationContext, workItemId }) => {
  return post({
    applicationContext,
    endpoint: `/api/work-items/${workItemId}/read`,
  });
};
