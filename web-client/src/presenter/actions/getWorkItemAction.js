import { state } from 'cerebral';

/**
 * fetch a single work item that matches the props.workItemId
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getWorkItem use case
 * @param {Function} providers.get the cerebral get method for getting the state.user.token
 * @param {Object} providers.props the cerebral props which contains props.workItemId
 * @returns {Object} the work item
 */
export const getWorkItemAction = async ({ applicationContext, get, props }) => {
  const workItem = await applicationContext.getUseCases().getWorkItem({
    applicationContext,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });
  return { workItem };
};
