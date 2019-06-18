import { state } from 'cerebral';

/**
 * sets a work item who matches the workItemId of props.workItemId as completed.
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral store object used for setting workQueue
 * @param {object} providers.applicationContext the cerebral store object used for setting workQueue
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.props.workItemId the workItemId to set as completed
 * @returns {Promise} async action
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
