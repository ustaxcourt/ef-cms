import { state } from 'cerebral';

export default async ({ get, store, applicationContext, props }) => {
  const completeWorkItemDate = new Date().toISOString();

  const caseDetail = get(state.caseDetail);
  let workItems = [];

  caseDetail.documents.forEach(
    document => (workItems = [...workItems, ...document.workItems]),
  );
  const workItemToUpdate = workItems.find(
    workItem => workItem.workItemId === props.workItemId,
  );
  const completeForm = get(state.completeForm);
  const message =
    (completeForm[props.workItemId] || {}).completeMessage ||
    'work item completed';

  workItemToUpdate.completedAt = completeWorkItemDate;
  workItemToUpdate.messages = [
    ...workItemToUpdate.messages,
    {
      message,
      sentBy: get(state.user.token),
      userId: get(state.user.token),
    },
  ];

  if (!workItemToUpdate.assigneeId) {
    workItemToUpdate.assigneeId = get(state.user.token);
    workItemToUpdate.assigneeName = get(state.user.name);
  }

  store.set(state.caseDetail, caseDetail);

  await applicationContext.getUseCases().updateWorkItem({
    applicationContext,
    workItemToUpdate,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });
};
