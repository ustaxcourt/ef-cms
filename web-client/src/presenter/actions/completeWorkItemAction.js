import { state } from 'cerebral';

/**
 * sets a work item who matches the workItemId of props.workItemId as completed.
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.get the cerebral store object used for setting workQueue
 * @param {Object} providers.applicationContext the cerebral store object used for setting workQueue
 * @param {Object} providers.props the cerebral props object
 * @param {Object} providers.props.workItemId the workItemId to set as completed
 * @returns {undefined} doesn't return anything
 */
export const completeWorkItemAction = async ({
  get,
  applicationContext,
  props,
}) => {
  const completeForm = get(state.completeForm);

  const completedMessage = (completeForm[props.workItemId] || {})
    .completeMessage;

  await applicationContext.getUseCases().completeWorkItem({
    applicationContext,
    completedMessage,
    userId: applicationContext.getCurrentUser().userId,
    workItemId: props.workItemId,
  });
};
