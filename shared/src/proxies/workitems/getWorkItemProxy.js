const { get } = require('../requests');

/**
 * getWorkItemProxy
 *
 * @param applicationContext
 * @param workItemId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.getWorkItem = ({ applicationContext, workItemId }) => {
  return get({
    applicationContext,
    endpoint: `/work-items/${workItemId}`,
  });
};
