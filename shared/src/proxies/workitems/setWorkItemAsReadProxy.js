const { post } = require('../requests');

/**
 * setWorkItemAsReadInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.workItemId the id of the work item to set as read
 * @returns {Promise<*>} the promise of the api call
 */
exports.setWorkItemAsReadInteractor = (applicationContext, { workItemId }) => {
  return post({
    applicationContext,
    endpoint: `/work-items/${workItemId}/read`,
  });
};
