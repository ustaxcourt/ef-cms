import { state } from 'cerebral';

export default async ({ applicationContext, get, store }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.sectionWorkQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);
  await applicationContext.getUseCases().assignWorkItems({
    applicationContext,
    workItems: selectedWorkItems.map(workItem => ({
      workItemId: workItem.workItemId,
      assigneeId,
      assigneeName,
    })),
    userId: get(state.user.token),
  });
  store.set(
    state.sectionWorkQueue,
    sectionWorkQueue.map(workItem => ({
      ...workItem,
      assigneeId,
      assigneeName,
    })),
  );
};
