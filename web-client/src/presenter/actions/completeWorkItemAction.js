import moment from 'moment';
import { state } from 'cerebral';

export default async ({ get, store, applicationContext, path, props }) => {
  const completeWorkItemDate = new Date().toISOString();

  const caseDetail = get(state.caseDetail);
  let workItems = [];
  caseDetail.documents.forEach(
    document => (workItems = [...workItems, ...document.workItems]),
  );
  const workItemToUpdate = workItems.find(
    workItem => workItem.workItemId === props.workItemId,
  );
  const message = get(state.form.completeMessage);
  console.log('message', message);
  workItemToUpdate.messages = [
    ...workItemToUpdate.messages,
    {
      message,
      sentBy: get(state.user.token),
      userId: get(state.user.token),
      completedAt: completeWorkItemDate,
    },
  ];
  if (!workItemToUpdate.assigneeId) {
    workItemToUpdate.assigneeId = get(state.user.token);
    workItemToUpdate.assigneeName = get(state.user.name);
  }

  store.set(state.caseDetail, caseDetail);

  const useCases = applicationContext.getUseCases();
  console.log('workItemToUpdate in action', workItemToUpdate);
  await useCases.updateWorkItem({
    applicationContext,
    workItemToUpdate,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });

  return path.success({
    alertSuccess: {
      title: 'Message successfully sent.',
      message: moment(completeWorkItemDate).format('L LT'),
    },
  });
};
