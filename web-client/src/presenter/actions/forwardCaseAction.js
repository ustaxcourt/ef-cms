import moment from 'moment';
import { state } from 'cerebral';

export default async ({ get, store, applicationContext, path, props }) => {
  const forwardSendDate = new Date().toISOString();

  const caseDetail = get(state.caseDetail);
  let workItems = [];
  caseDetail.documents.forEach(
    document => (workItems = [...workItems, ...document.workItems]),
  );
  const workItemToUpdate = workItems.find(
    workItem => workItem.workItemId === props.workItemId,
  );
  const form = get(state.form)[props.workItemId];

  workItemToUpdate.assigneeId = form.forwardRecipientId;
  workItemToUpdate.assigneeName = 'Senior Attorney';
  const message = form.forwardMessage;
  workItemToUpdate.messages = [
    ...workItemToUpdate.messages,
    {
      message,
      userId: get(state.user.token),
      sentBy: get(state.user.name),
      sentTo: 'Senior Attorney',
    },
  ];
  store.set(state.caseDetail, caseDetail);

  const useCases = applicationContext.getUseCases();
  await useCases.updateWorkItem({
    applicationContext,
    workItemToUpdate,
    workItemId: props.workItemId,
    userId: get(state.user.token),
  });

  return path.success();
};
