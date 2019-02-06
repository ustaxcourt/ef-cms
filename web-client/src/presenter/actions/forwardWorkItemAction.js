import { state } from 'cerebral';

export default async ({ get, store, applicationContext, props }) => {
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
