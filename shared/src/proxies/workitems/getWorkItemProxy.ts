import { get } from '../requests';

/**
 * getWorkItemProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.workItemId the id of the work item to get
 * @returns {Promise<*>} the promise of the api call
 */
export const getWorkItemInteractor = ({ applicationContext, workItemId }) => {
  return get({
    applicationContext,
    endpoint: `/work-items/${workItemId}`,
  });
};
