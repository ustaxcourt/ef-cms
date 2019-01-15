import { state } from 'cerebral';

export default async ({ get, store, applicationContext, path, props }) => {
  const { workItemId } = props;

  const form = get(state.form)[props.workItemId];
  const userId = get(state.user.userId);

  const useCases = applicationContext.getUseCases();
  try {
    const updatedWorkItem = await useCases.forwardWorkItem({
      userId,
      message: form.forwardMessage,
      workItemId: workItemId,
      assigneeId: form.forwardRecipientId,
      applicationContext,
    });

    // update the local state to have the updated work item returned from the backend
    const caseDetail = get(state.caseDetail);
    const workItems = caseDetail.documents.reduce(
      (acc, cur) => [...acc, ...(cur.workItems || [])],
      [],
    );
    const workItem = workItems.find(item => item.workItemId === workItemId);
    Object.assign(workItem, updatedWorkItem);
    store.set(state.caseDetail, caseDetail);

    return path.success({
      alertSuccess: {
        title: 'Message sent',
        message: 'Your message has been sent.',
      },
    });
  } catch (error) {
    return path.error({
      alertError: {
        title: 'Errors were found. Please correct your form and resubmit.',
      },
    });
  }
};
