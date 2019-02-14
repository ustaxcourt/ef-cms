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
      sentBy: applicationContext.getCurrentUser().userId,
      userId: applicationContext.getCurrentUser().userId,
    },
  ];

  if (!workItemToUpdate.assigneeId) {
    workItemToUpdate.assigneeId = applicationContext.getCurrentUser().userId;
    workItemToUpdate.assigneeName = applicationContext.getCurrentUser().name;
  }

  store.set(state.caseDetail, caseDetail);

  await applicationContext.getUseCases().updateWorkItem({
    applicationContext,
    workItemToUpdate,
    workItemId: props.workItemId,
    userId: applicationContext.getCurrentUser().userId,
  });
};
