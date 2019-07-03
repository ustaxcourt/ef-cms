import { state } from 'cerebral';

/**
 * fetch a single work item that matches the props.workItemId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getWorkItem use case
 * @param {Function} providers.get the cerebral get method for getting the state.user.token
 * @param {object} providers.props the cerebral props which contains props.workItemId
 * @returns {object} the work item
 */
export const getWorkItemAction = async ({ applicationContext, get, props }) => {
  const workItem = await applicationContext
    .getUseCases()
    .getWorkItemInteractor({
      applicationContext,
      userId: get(state.user.token),
      workItemId: props.workItemId,
    });
  return { workItem };
};
