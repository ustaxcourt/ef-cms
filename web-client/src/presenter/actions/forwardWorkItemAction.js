import { state } from 'cerebral';

/**
 * Forwards the workItem associated with props.workItemId to a form.forwardRecipientId and also adds the message set on form.forwardMessage.
 * Displays a success alert on success.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.user.userId, state.form
 * @param {Object} providers.store the cerebral store needed for when setting caseDetail
 * @param {Object} providers.applicationContext needed for getting the forwardWorkItem use case
 * @param {Object} providers.props the cerebral props object containing workItemId
 * @returns {Object} the success alert object used for displayinng a green alert at the top of the page
 */
export const forwardWorkItemAction = async ({
  get,
  store,
  applicationContext,
  props,
}) => {
  const { workItemId } = props;

  const form = get(state.form)[props.workItemId];
  const userId = get(state.user.userId);

  const updatedWorkItem = await applicationContext
    .getUseCases()
    .forwardWorkItem({
      userId,
      message: form.forwardMessage,
      workItemId: workItemId,
      assigneeId: form.forwardRecipientId,
      applicationContext,
    });

  // update the local state to have the updated work item returned from the backend
  const caseDetail = get(state.caseDetail);
  const workItems = caseDetail.documents.reduce(
    (items, document) => [...items, ...document.workItems],
    [],
  );
  const workItem = workItems.find(item => item.workItemId === workItemId);
  Object.assign(workItem, updatedWorkItem);
  store.set(state.caseDetail, caseDetail);

  return {
    alertSuccess: {
      title: 'Message sent',
      message: 'Your message has been sent.',
    },
  };
};
