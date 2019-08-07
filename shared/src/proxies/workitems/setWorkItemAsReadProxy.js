const { post } = require('../requests');

/**
 * setWorkItemAsReadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.workItemId the id of the work item to set as read
 * @returns {Promise<*>} the promise of the api call
 */
exports.setWorkItemAsReadInteractor = ({ applicationContext, workItemId }) => {
  return post({
    applicationContext,
    endpoint: `/work-items/${workItemId}/read`,
  });
};
