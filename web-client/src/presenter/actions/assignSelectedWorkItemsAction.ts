import { state } from '@web-client/presenter/app.cerebral';

export const assignSelectedWorkItemsAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const selectedWorkItems = get(state.selectedWorkItems);
  const sectionWorkQueue = get(state.workQueue);
  const assigneeId = get(state.assigneeId);
  const assigneeName = get(state.assigneeName);

  const workItemIds: string[] = [];

  selectedWorkItems.forEach(workItem => {
    workItemIds.push(workItem.workItemId);
    workItem.groupedMemberCases?.forEach(item => {
      workItemIds.push(item.workItemId);
    });
  });

  await applicationContext
    .getUseCases()
    .assignWorkItemsInteractor(applicationContext, {
      assigneeId,
      assigneeName,
      workItemIds,
    });

  // Give elasticsearch a chance to catch up
  // TODO: we need a better solution for this; this is causing flaky functionality and failing cypress tests
  await new Promise(resolve => setTimeout(resolve, 3000));

  const memberWorkItemIds = selectedWorkItems.flatMap(
    item => item.groupedMemberCases?.map(member => member.workItemId) ?? [],
  );

  store.set(
    state.workQueue,
    sectionWorkQueue.map(workItem => {
      if (
        selectedWorkItems.find(
          item => item.workItemId === workItem.workItemId,
        ) ||
        memberWorkItemIds.includes(workItem.workItemId)
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
  store.unset(state.assigneeId);
  store.unset(state.assigneeName);
};
