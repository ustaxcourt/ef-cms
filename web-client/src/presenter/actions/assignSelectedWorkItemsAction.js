import { state } from 'cerebral';

export default async ({ applicationContext, get, store }) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.workQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);

  await applicationContext.getUseCases().assignWorkItems({
    applicationContext,
    workItems: selectedWorkItems.map(workItem => ({
      workItemId: workItem.workItemId,
      assigneeId,
      assigneeName,
    })),
  });

  store.set(
    state.workQueue,
    sectionWorkQueue.map(workItem => {
      if (
        selectedWorkItems.find(item => item.workItemId === workItem.workItemId)
      ) {
        return {
          ...workItem,
          assigneeId,
          assigneeName,
        };
      } else {
        return workItem;
      }
    }),
  );

  store.set(state.selectedWorkItems, []);
  store.set(state.assigneeId, null);
  store.set(state.assigneeName, null);
};
